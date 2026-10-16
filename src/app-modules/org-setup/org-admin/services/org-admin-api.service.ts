import {Injectable, Injector} from "@angular/core";
import {Observable, Subject, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {
    Branding, BrandingSlot, FeaturesRes, INTEGRATION_LOG_SERIALIZER, INTEGRATION_SERIALIZER, IntegrationCatalog, IntegrationDto,
    IntegrationLogRes, IntegrationLogRow, IntegrationRes, IntegrationRow, IntegrationSavedRes, IntegrationTestRes, MEMBER_SERIALIZER,
    MemberRow, OrgProfile, OrgProfileRes, OrgSettings, OrgSettingsRes, ROLE_SERIALIZER, RoleDto, RoleLookups, RoleRes, RoleRow,
    BRANCH_SERIALIZER, BranchDto, BranchRow, HOST_SERIALIZER, HostDto, HostRow, MEMBER_TYPE_SERIALIZER, MemberTypeRow,
    REQUIREMENT_SERIALIZER, RequirementDto, RequirementRow, PORTLET_SERIALIZER, PortletRow, PortletSettings
} from "../domains/org-admin.models";

/** The API's message (validation, 403 "you need … permission", 409 conflicts) or a fallback. */
export const errorMessageOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || (typeof error?.message === 'string' ? error.message : null) || fallback;
};

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

/** Tenant API `api/v1/org-admin/*` (everything except the paged grids, which use the grid services below). */
@Injectable()
export class OrgAdminApiService extends CoreEndpointBase {
    private catalog$: Observable<IntegrationCatalog> | null = null;
    private roleLookups$: Observable<RoleLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get url() { return `${this.baseSectorAPIUrl}/v1/org-admin`; }

    private get<T>(path: string): Observable<T> {
        return this.httpClient.get(`${this.url}/${path}`, this.requestHeaders).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.url}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    /** Absolute URL of a branding image (served without sign-in). */
    assetUrl(id: string | null | undefined) { return id ? `${this.url}/branding/assets/${id}` : null; }

    // Profile, settings, features, branding
    profile() { return this.get<OrgProfileRes>('profile'); }
    saveProfile(body: OrgProfile) { return this.send<OrgProfileRes>('PUT', 'profile', body); }
    settings() { return this.get<OrgSettingsRes>('settings'); }
    saveSettings(body: OrgSettings) { return this.send<OrgSettingsRes>('PUT', 'settings', body); }
    features() { return this.get<FeaturesRes>('features'); }
    setFeature(code: string, enabled: boolean) { return this.send<FeaturesRes>('PUT', 'features', {code, enabled}); }
    branding() { return this.get<Branding>('branding'); }
    saveColors(primaryColor: string | null, accentColor: string | null) { return this.send<Branding>('PUT', 'branding', {primaryColor, accentColor}); }
    uploadImage(slot: BrandingSlot, file: File): Observable<Branding> {
        const form = new FormData();
        form.append('file', file, file.name);
        return this.httpClient.post(`${this.url}/branding/${slot}`, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<Branding>(r)), catchError(e => this.handleError(e, () => this.uploadImage(slot, file))));
    }
    removeImage(slot: BrandingSlot) { return this.send<Branding>('DELETE', `branding/${slot}`); }

    // Roles and members
    roleLookups(refresh = false) {
        if (refresh || !this.roleLookups$) { this.roleLookups$ = this.get<RoleLookups>('roles/lookups').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.roleLookups$;
    }
    role(id: string) { return this.get<RoleRes>(`roles/${id}`); }
    createRole(body: RoleDto) { return this.send<RoleRes>('POST', 'roles', body); }
    updateRole(id: string, body: RoleDto) { return this.send<RoleRes>('PUT', `roles/${id}`, body); }
    deleteRole(id: string) { return this.send<void>('DELETE', `roles/${id}`); }
    setMemberRoles(membershipId: string, roleIds: string[]) { return this.send<MemberRow>('PUT', `members/${membershipId}/roles`, {roleIds}); }

    // Integrations
    catalog() {
        if (!this.catalog$) { this.catalog$ = this.get<IntegrationCatalog>('integrations/catalog').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.catalog$;
    }
    integration(id: string) { return this.get<IntegrationRes>(`integrations/${id}`); }
    createIntegration(body: IntegrationDto) { return this.send<IntegrationSavedRes>('POST', 'integrations', body); }
    updateIntegration(id: string, body: IntegrationDto) { return this.send<IntegrationSavedRes>('PUT', `integrations/${id}`, body); }
    deleteIntegration(id: string) { return this.send<void>('DELETE', `integrations/${id}`); }
    makeDefault(id: string) { return this.send<IntegrationRes>('POST', `integrations/${id}/default`); }
    rotateSecret(id: string) { return this.send<IntegrationSavedRes>('POST', `integrations/${id}/rotate-secret`); }
    testIntegration(id: string, to: string | null) { return this.send<IntegrationTestRes>('POST', `integrations/${id}/test`, {to}); }
    activityItem(id: string) { return this.get<IntegrationLogRes>(`integrations/activity/${id}`); }
    redeliver(id: string) { return this.send<IntegrationLogRow>('POST', `integrations/activity/${id}/redeliver`); }

    // Branches, hosts, member types, requirements
    createBranch(body: BranchDto) { return this.send<BranchRow>('POST', 'branches', body); }
    updateBranch(id: string, body: BranchDto) { return this.send<BranchRow>('PUT', `branches/${id}`, body); }
    makeHeadBranch(id: string) { return this.send<BranchRow>('POST', `branches/${id}/head`); }
    reseedBranch(id: string) { return this.send<BranchRow>('POST', `branches/${id}/reseed`); }
    createHost(body: HostDto) { return this.send<HostRow>('POST', 'hosts', body); }
    updateHost(id: number, body: HostDto) { return this.send<HostRow>('PUT', `hosts/${id}`, body); }
    deleteHost(id: number) { return this.send<void>('DELETE', `hosts/${id}`); }
    updateMemberType(id: string, body: {name: string; registrationNoFormat: string | null}) { return this.send<MemberTypeRow>('PUT', `member-types/${id}`, body); }
    addRelation(memberTypeId: string, name: string) { return this.send<MemberTypeRow>('POST', `member-types/${memberTypeId}/relations`, {name}); }
    removeRelation(memberTypeId: string, relationId: string) { return this.send<MemberTypeRow>('DELETE', `member-types/${memberTypeId}/relations/${relationId}`); }
    createRequirement(body: RequirementDto) { return this.send<RequirementRow>('POST', 'requirements', body); }
    updateRequirement(id: string, body: RequirementDto) { return this.send<RequirementRow>('PUT', `requirements/${id}`, body); }
    deleteRequirement(id: string) { return this.send<void>('DELETE', `requirements/${id}`); }

    savePortlet(code: string, body: PortletSettings) { return this.send<PortletRow>('PUT', `portlets/${encodeURIComponent(code)}`, body); }

    /** The page's absolute inbound webhook URL from the API's relative route. */
    absoluteApiUrl(relative: string) { return `${this.baseSectorAPIUrl}/${relative.replace(/^api\//, '')}`; }
}

/** Paged `GET v1/org-admin/roles` for ViewExtender grids. */
@Injectable()
export class RoleGridService extends OrgResourceService<RoleRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/roles', ROLE_SERIALIZER); }
}

/** Paged `GET v1/org-admin/members` for ViewExtender grids. */
@Injectable()
export class MemberGridService extends OrgResourceService<MemberRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/members', MEMBER_SERIALIZER); }
}

/** Paged `GET v1/org-admin/integrations` for ViewExtender grids. */
@Injectable()
export class IntegrationGridService extends OrgResourceService<IntegrationRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/integrations', INTEGRATION_SERIALIZER); }
}

/** Paged `GET v1/org-admin/integrations/activity` for ViewExtender grids. */
@Injectable()
export class IntegrationLogGridService extends OrgResourceService<IntegrationLogRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/integrations/activity', INTEGRATION_LOG_SERIALIZER); }
}

/** Paged `GET v1/org-admin/branches` for ViewExtender grids. */
@Injectable()
export class BranchGridService extends OrgResourceService<BranchRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/branches', BRANCH_SERIALIZER); }
}

/** Paged `GET v1/org-admin/hosts` for ViewExtender grids. */
@Injectable()
export class HostGridService extends OrgResourceService<HostRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/hosts', HOST_SERIALIZER); }
}

/** Paged `GET v1/org-admin/member-types` for ViewExtender grids. */
@Injectable()
export class MemberTypeGridService extends OrgResourceService<MemberTypeRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/member-types', MEMBER_TYPE_SERIALIZER); }
}

/** Paged `GET v1/org-admin/requirements` for ViewExtender grids. */
@Injectable()
export class RequirementGridService extends OrgResourceService<RequirementRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/requirements', REQUIREMENT_SERIALIZER); }
}

/** `GET v1/org-admin/portlets` (the catalog with this organisation's settings) for ViewExtender grids. */
@Injectable()
export class PortletGridService extends OrgResourceService<PortletRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/org-admin/portlets', PORTLET_SERIALIZER); }
}

/** A button pressed inside a grid cell (org-grid has no output for cells, so cells report here and the view listens). */
export interface GridCellAction { action: string; row: any; }

@Injectable()
export class OrgAdminGridEvents {
    readonly actions$ = new Subject<GridCellAction>();
    emit(action: string, row: any) { this.actions$.next({action, row}); }
}

export const ORG_ADMIN_SERVICES = [
    OrgAdminApiService, RoleGridService, MemberGridService, IntegrationGridService, IntegrationLogGridService, OrgAdminGridEvents,
    BranchGridService, HostGridService, MemberTypeGridService, RequirementGridService, PortletGridService
];
