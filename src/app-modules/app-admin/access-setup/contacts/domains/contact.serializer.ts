import {CoreQueryOptions, CoreResource} from "@app-global";

export class ContactQueryOptions extends CoreQueryOptions {
    contactType:  string;
    constructor(model: any = {}) { super(model); }
    override toQueryString (){
        const obj = { contactType: this.contactType };
        return super.getParamByObject(obj);
    }
}

export class ContactRole {
    roleId: string;
    roleName: string;
    roleMapperId: string;
    orgUserRoleId: string;
    status: boolean;
    constructor(model: any = <any>{}) {
        const { roleId, roleName, roleMapperId, orgUserRoleId, status } = model;
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleMapperId = roleMapperId;
        this.orgUserRoleId = orgUserRoleId;
        this.status = status;
    }
}

export class Contact extends CoreResource
{
    id: string;
    accountId: string;
    email: string;
    fName: string;
    lName: string;
    isDemo: boolean;
    phone: string;

    profileUrl: string;
    profileId: string;

    userTypeId: number;
    userTypeName: string;
    userMasterType: string;
    orgUserId: string;

    status: string;
    isLocked: boolean;

    roles: Array<ContactRole>;
    orgUnitId: string;
    orgBranchId: string;

    constructor(model: any = <any>{}){
        super();
        const {
            id, accountId, email, fName, lName, phone, profileId, userTypeId, orgUserId, userTypeName, userMasterType, status, isLocked,
            roles, orgUnitId, orgBranchId
        } = model;
        this.id = id;
        this.accountId = accountId;
        this.email = email;
        this.fName = fName;
        this.lName = lName;
        this.phone = phone;

        this.profileId = profileId;
        this.userTypeId = userTypeId;
        this.orgUserId = orgUserId;

        this.userMasterType = userMasterType;
        this.userTypeName = userTypeName;

        this.status = status;
        this.isLocked = isLocked;

        this.roles = (roles || []).map(r => new ContactRole(r));
        this.orgUnitId = orgUnitId;
        this.orgBranchId = orgBranchId;
    }

    public get name () { return `${this.fName} ${this.lName}`; }
    public activeRoles =()=>{
        return `${this.roles.filter(r => r.roleMapperId).map(r => r.roleName)}`;
    }
}

export class ContactSerializer {
    fromJson(json: any): Contact {
        return new Contact(json);
    }
    toJson(model: any): any {
        return model;
    }
}
