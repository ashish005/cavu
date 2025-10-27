interface OrgTheme {
    fontId:number;
    font: string;
    id: number | string;
    isBoxedLayout: boolean;
    isFixedAside: boolean;
    isFixedContent: boolean;
    isFoldedAside: boolean;
    isFullscreen: boolean;
    name: string;
    code: string;
}

type ModulePermissionNames =
    'View Users' | 'Manage Users' |
    'View Roles' | 'Manage Roles' | 'Assign Roles';

type ModulePermissionValues =
    'users.view' | 'users.manage' |
    'roles.view' | 'roles.manage' | 'roles.assign';

export interface LoginResponse {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    profile: any;
    theme: any;
}

export interface AccessToken {
    nbf: number;
    exp: number;
    iss: string;
    aud: string | string[];
    client_id: string;
    sub: string;
    auth_time: number;
    idp: string;
    role: string | string[];
    permission: ModulePermissionValues | ModulePermissionValues[];
    name: string;
    email: string;
    phone_number: string;
    fullname: string;
    jobtitle: string;
    configuration: string;
    scope: string | string[];
    amr: string[];

    orgUnitId: string,
    orgBranchId: string,
    accountId: string,
    countryId: string,
    userTypeId: string,
    userType: string,
    appType: string,
    appSectorType: string,
    theme: OrgTheme
}


