import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity, ViewExtender} from "@app-global";
import {
    MemberQueryOptions, MemberRow, PermissionDef, PermissionGroup, RoleDto, RoleLookups, RoleQueryOptions, RoleRow
} from "../domains/org-admin.models";
import {MemberGridService, OrgAdminApiService, OrgAdminGridEvents, RoleGridService, errorMessageOf} from "../services/org-admin-api.service";
import {MemberNameCell, MemberRolesCell, RoleNameCell} from "../grid-cells/org-admin-cells";

const ACTIONS = ['View', 'Create', 'Modify', 'Destroy'] as const;

/** Roles grid; a role opens in the right-hand editor. */
@Component({standalone: false, templateUrl: './templates/roles.html'})
export class OrgRolesView extends ViewExtender<RoleRow> implements OnInit {
    override coreState = new RoleQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    lookups: RoleLookups | null = null;
    /** The role in the editor: an id, 'new', or null when closed. */
    editing: string | null = null;

    constructor(public override service: RoleGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private events: OrgAdminGridEvents) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Role', field: 'name', cellTemplate: RoleNameCell},
            {headerName: 'For', field: 'userTypeName'},
            {headerName: 'Permissions', field: 'permissionLabel'},
            {headerName: 'Members', field: 'memberCount', class: 'text-right'}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The roles could not be loaded.') : null; }

    ngOnInit() {
        this.api.roleLookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.actionCb(a.row); } });
        this.populateGrid();
    }

    actionCb(row: RoleRow) { this.editing = row.id; }

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    closed(changed: boolean) {
        this.editing = null;
        if (changed) {
            this.api.roleLookups(true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
            this.populateGrid();
        }
    }
}

/** Create or edit a role: name, who it is for, and its permissions as a module × action matrix. */
@Component({selector: 'org-role-editor', standalone: false, templateUrl: './templates/role-editor.html'})
export class OrgRoleEditorComponent implements OnInit {
    @Input({required: true}) roleId!: string;
    @Input({required: true}) lookups!: RoleLookups;
    @Output() done = new EventEmitter<boolean>();

    private readonly destroyRef = inject(DestroyRef);
    readonly actions = ACTIONS;
    readonly actionNames: Record<string, string> = {View: 'View', Create: 'Create', Modify: 'Change', Destroy: 'Delete'};

    role: RoleRow | null = null;
    model: RoleDto = {name: '', description: null, userTypeId: '', isActive: true, permissions: []};
    selected = new Set<string>();
    loading = false;
    saving = false;
    error: string | null = null;

    constructor(private api: OrgAdminApiService, private alerts: AlertService) {}

    get isNew() { return this.roleId === 'new'; }
    get isAdminRole() { return !!this.role?.allPermissions; }
    get moduleGroups() { return this.lookups.permissionGroups.filter(g => g.permissions.every(p => ACTIONS.some(a => p.code === `${g.moduleCode}.${a}`))); }
    get otherGroups() { return this.lookups.permissionGroups.filter(g => !this.moduleGroups.includes(g)); }

    ngOnInit() {
        if (this.isNew) {
            this.model.userTypeId = this.lookups.userTypes.find(t => t.code === 'employee')?.id ?? this.lookups.userTypes[0]?.id ?? '';
            return;
        }
        this.loading = true;
        this.api.role(this.roleId).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.role = r.role;
                this.model = {name: r.role.name, description: r.role.description, userTypeId: r.role.userTypeId, isActive: r.role.isActive, permissions: r.permissions};
                this.selected = new Set(r.permissions);
            },
            error: e => this.error = errorMessageOf(e, 'The role could not be loaded.')
        });
    }

    code(group: PermissionGroup, action: string) { return `${group.moduleCode}.${action}`; }
    has(code: string) { return this.isAdminRole || this.selected.has(code); }

    toggle(code: string) {
        if (this.isAdminRole) { return; }
        const [module, action] = code.split('.');
        if (this.selected.has(code)) {
            this.selected.delete(code);
            // Without View nothing else in the module is usable.
            if (action === 'View') { ACTIONS.forEach(a => this.selected.delete(`${module}.${a}`)); }
        } else {
            this.selected.add(code);
            if (ACTIONS.includes(action as any) && action !== 'View') { this.selected.add(`${module}.View`); }
        }
    }

    rowState(group: PermissionGroup): 'all' | 'some' | 'none' {
        const n = ACTIONS.filter(a => this.has(this.code(group, a))).length;
        return n === ACTIONS.length ? 'all' : n ? 'some' : 'none';
    }

    toggleRow(group: PermissionGroup) {
        if (this.isAdminRole) { return; }
        const all = this.rowState(group) === 'all';
        ACTIONS.forEach(a => all ? this.selected.delete(this.code(group, a)) : this.selected.add(this.code(group, a)));
    }

    title(p: PermissionDef) { return p.description ? `${p.name}: ${p.description}` : p.name; }

    save() {
        if (!this.model.name?.trim()) { this.error = 'Give the role a name.'; return; }
        const body: RoleDto = {...this.model, name: this.model.name.trim(), permissions: [...this.selected]};
        this.saving = true;
        this.error = null;
        const call = this.isNew ? this.api.createRole(body) : this.api.updateRole(this.roleId, body);
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.alerts.showMessage('Saved', `${r.role.name} saved. Members get the change on their next request.`, MessageSeverity.success);
                this.done.emit(true);
            },
            error: e => this.error = errorMessageOf(e, 'The role could not be saved.')
        });
    }

    remove() {
        if (!this.role || !confirm(`Delete the role "${this.role.name}"?`)) { return; }
        this.saving = true;
        this.api.deleteRole(this.role.id).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.done.emit(true),
            error: e => this.error = errorMessageOf(e, 'The role could not be deleted.')
        });
    }
}

/** Members grid with their roles; roles change in the right-hand panel. */
@Component({standalone: false, templateUrl: './templates/members.html'})
export class OrgMembersView extends ViewExtender<MemberRow> implements OnInit {
    override coreState = new MemberQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    lookups: RoleLookups | null = null;
    member: MemberRow | null = null;
    chosen = new Set<string>();
    saving = false;
    editError: string | null = null;

    constructor(public override service: MemberGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private events: OrgAdminGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Member', field: 'name', cellTemplate: MemberNameCell},
            {headerName: 'Type', field: 'userTypeName'},
            {headerName: 'Roles', field: 'roles', cellTemplate: MemberRolesCell},
            {headerName: 'Branches', field: 'branchLabel'}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The members could not be loaded.') : null; }

    /** Roles a member can hold: active roles for their member type. */
    get memberRoles() { return (this.lookups?.roles ?? []).filter(r => r.userTypeId === this.member?.userTypeId && (r.isActive || this.chosen.has(r.id))); }

    ngOnInit() {
        this.api.roleLookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'roles') { this.open(a.row); } });
        this.populateGrid();
    }

    actionCb(_: any) {}

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    open(row: MemberRow) {
        this.member = row;
        this.chosen = new Set(row.roles.map(r => r.id));
        this.editError = null;
    }

    flip(id: string) { this.chosen.has(id) ? this.chosen.delete(id) : this.chosen.add(id); }

    saveRoles() {
        if (!this.member) { return; }
        if (!this.chosen.size) { this.editError = 'Choose at least one role.'; return; }
        this.saving = true;
        this.editError = null;
        this.api.setMemberRoles(this.member.membershipId, [...this.chosen]).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: m => {
                this.alerts.showMessage('Saved', `${m.name} now has: ${m.roles.map(r => r.name).join(', ')}.`, MessageSeverity.success);
                this.member = null;
                this.populateGrid();
            },
            error: e => this.editError = errorMessageOf(e, 'The roles could not be changed.')
        });
    }
}
