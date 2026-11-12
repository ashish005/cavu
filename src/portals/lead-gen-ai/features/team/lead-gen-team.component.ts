import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, ClientBusinessUser, ClientBusinessInvitation,
  ClientBusinessRole, PermissionsResponse, OrgMember
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

const ROLES: { value: ClientBusinessRole; label: string; desc: string }[] = [
  { value: 'Viewer', label: 'Viewer', desc: 'Read-only access' },
  { value: 'Editor', label: 'Editor', desc: 'Read + manage records' },
  { value: 'ClientAdmin', label: 'Client Admin', desc: 'Full control of this business' }
];

@Component({
  selector: 'lead-gen-team',
  templateUrl: './lead-gen-team.component.html',
  styleUrls: ['./lead-gen-team.component.scss'],
  standalone: false
})
export class LeadGenTeamComponent implements OnInit {
  readonly perms = inject(LeadGenPermissionsService);
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  users: ClientBusinessUser[] = [];
  invitations: ClientBusinessInvitation[] = [];
  orgMembers: OrgMember[] = [];
  selectedOrgMember?: OrgMember;
  orgPage = 1;

  orgMemberGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'User', field: 'user' }, { headerName: 'Org role', field: 'role' },
      { headerName: 'Status', field: 'status' }, { headerName: 'Assigned', field: 'assigned' }
    ]
  };

  get orgMemberRows(): any[] {
    return this.orgMembers.map(m => ({
      ...m, user: m.userId.slice(0, 8) + '…', status: m.isActive ? 'Active' : 'Revoked',
      assigned: new Date(m.assignedAt).toLocaleDateString()
    }));
  }
  get pagedOrgMemberRows(): any[] { return this.orgMemberRows.slice((this.orgPage - 1) * this.pageSize, this.orgPage * this.pageSize); }
  myPermissions?: PermissionsResponse;
  loading = false;
  error = '';
  message = '';
  selectedUser?: ClientBusinessUser;
  selectedInvite?: ClientBusinessInvitation;
  page = 1;
  pageSize = 10;

  userGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'User', field: 'user' }, { headerName: 'Role', field: 'role' },
      { headerName: 'Assigned', field: 'assigned' }
    ]
  };
  inviteGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Email', field: 'email' }, { headerName: 'Role', field: 'role' },
      { headerName: 'Status', field: 'status' }, { headerName: 'Expires', field: 'expires' }
    ]
  };

  get userRows(): any[] {
    return this.users.map(u => ({
      ...u, user: u.userId.slice(0, 8) + '…',
      assigned: new Date(u.assignedAt).toLocaleDateString()
    }));
  }
  get pagedUserRows(): any[] { return this.userRows.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get inviteRows(): any[] {
    return this.invitations.map(i => ({
      ...i, expires: new Date(i.expiresAt).toLocaleDateString()
    }));
  }
  get roles(): typeof ROLES { return ROLES; }

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length) this.clientBusinessId = bs[0].id;
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
    this.api.getPermissions().subscribe({ next: (p) => this.myPermissions = p, error: () => undefined });
    this.api.listOrganizationMembers().subscribe({ next: (m) => this.orgMembers = m, error: () => undefined });
  }

  onBusinessChange(id: string): void { this.clientBusinessId = id; this.page = 1; this.load(); }
  onPage(e: any): void { this.page = Math.floor(e.skip / e.take) + 1; }

  load(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.loading = true;
    this.error = '';
    this.api.listClientBusinessUsers(cb).subscribe({
      next: (u) => { this.users = u; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.listClientBusinessInvitations(cb).subscribe({ next: (i) => this.invitations = i, error: () => undefined });
  }

  openPopup(fields: EntityFormField[], submitLabel: string, run: (v: Record<string, string>) => Observable<unknown>, onDone?: () => void): void {
    const parameters = {
      fields, submitLabel,
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        run(values).subscribe({
          next: () => { this.popupService.destroy(); onDone?.(); resolve(); },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { size: 'W_50' }, parameters)
      .then(() => this.popupService.destroy(), () => this.popupService.destroy());
  }

  selectUser(row: any): void { this.selectedUser = this.users.find(u => u.userId === row.userId); }
  selectInviteRow(row: any): void { this.selectedInvite = this.invitations.find(i => i.id === row.id); }
  selectOrgMemberRow(row: any): void { this.selectedOrgMember = this.orgMembers.find(m => m.userId === row.userId); }
  onOrgPage(e: any): void { this.orgPage = Math.floor(e.skip / e.take) + 1; }

  changeOrgRole(m: OrgMember): void {
    this.openPopup([
      { key: 'role', label: 'Organization role', type: 'select', required: true,
        options: ['Owner', 'Admin', 'Member'].map(r => ({ value: r, label: r })) }
    ], `Change org role for ${m.userId.slice(0, 8)}…`, (v) =>
      this.api.assignOrganizationMember(m.userId, v['role']),
      () => { this.message = 'Organization role updated.'; this.load(); });
  }

  revokeOrgMember(m: OrgMember): void {
    if (!confirm(`Revoke organization membership for ${m.userId.slice(0, 8)}…?`)) return;
    this.api.revokeOrganizationMember(m.userId).subscribe({
      next: () => { this.message = 'Membership revoked.'; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  changeRole(u: ClientBusinessUser): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'role', label: 'Role', type: 'select', required: true,
        options: ROLES.map(r => ({ value: r.value, label: `${r.label} — ${r.desc}` })) }
    ], `Change role for ${u.userId.slice(0, 8)}…`, (v) =>
      this.api.assignClientBusinessUser(cb, u.userId, v['role'] as ClientBusinessRole),
      () => { this.message = 'Role updated.'; this.load(); });
  }

  revokeUser(u: ClientBusinessUser): void {
    const cb = this.clientBusinessId;
    if (!cb || !confirm(`Remove ${u.userId.slice(0, 8)}… from this business?`)) return;
    this.api.revokeClientBusinessUser(cb, u.userId).subscribe({
      next: () => { this.message = 'User removed.'; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  invite(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'email', label: 'Email', required: true },
      { key: 'role', label: 'Role', type: 'select', required: true,
        options: ROLES.map(r => ({ value: r.value, label: `${r.label} — ${r.desc}` })) }
    ], 'Invite user', (v) => this.api.inviteClientBusinessUser(cb, {
      email: v['email'], role: v['role'] as ClientBusinessRole
    } as any), () => { this.message = 'Invitation sent.'; this.load(); });
  }

  revokeInvite(i: ClientBusinessInvitation): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.revokeClientBusinessInvitation(cb, i.id).subscribe({
      next: () => { this.message = 'Invitation revoked.'; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
