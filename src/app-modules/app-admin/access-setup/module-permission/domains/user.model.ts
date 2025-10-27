import {CoreQueryOptions} from "@app-global";

export class UserQueryOptions extends CoreQueryOptions{}

export class UserRole {
    constructor(model) {
        const { id, name, displayName } = model;
        this.id = id;
        this.name = name;
        this.displayName = displayName;
    }

    public id: string;
    public name: string;
    public displayName: string;
}

export class User {
    public id: string;
    public userId: string;
    public name: string;
    public userName: string;

    public phoneNumber: string;
    public email: string;
    public fName: string;
    public lName: string;

    public userTypeId: string;
    public userTypeName: string;

    public roles: UserRole[];
    public orgUnitId: string;
    public orgBranchId: string;
    public countryId: string;

    public isEnabled: boolean;

    accessFailedCount: number;
    concurrencyStamp: string;
    lockoutEnabled: boolean;
    phoneNumberConfirmed: boolean;
    sourceApplicationType: number;
    sourceBrowserType: number;
    sourceDeviceType: number;
    status: string;
    twoFactorEnabled: boolean;
    webAccessAllowed: boolean;

    get fullName(): string {
        let name = this.fName || this.lName;
        return name;
    }

    constructor(model) {
        const {
            id, userId, userName, name, fName, lName,
            phoneNumber, email,
            userTypeId, userTypeName,
            roles, orgUnitId, orgBranchId, countryId,
            isEnabled, accessFailedCount, concurrencyStamp, lockoutEnabled,
            phoneNumberConfirmed, sourceApplicationType, sourceBrowserType, sourceDeviceType,
            status, twoFactorEnabled, webAccessAllowed
        } = model;
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.name = name;

        this.phoneNumber = phoneNumber;
        this.email = email;
        this.fName = fName;
        this.lName = lName;

        this.userTypeId = userTypeId;
        this.userTypeName = userTypeName;

        this.roles = (roles || []).map(r => new UserRole(r));
        this.orgUnitId = orgUnitId;
        this.orgBranchId = orgBranchId;
        this.countryId = countryId;

        this.isEnabled = isEnabled;
        this.accessFailedCount = accessFailedCount;
        this.concurrencyStamp = concurrencyStamp;
        this.lockoutEnabled = lockoutEnabled;
        this.phoneNumberConfirmed = phoneNumberConfirmed;
        this.sourceApplicationType = sourceApplicationType;
        this.sourceBrowserType = sourceBrowserType;
        this.sourceDeviceType = sourceDeviceType;
        this.status = status;
        this.twoFactorEnabled = twoFactorEnabled;
        this.webAccessAllowed = webAccessAllowed;
    }

    public get displayRoles() {
        return this.roles.map(r => ' '+ r.displayName);
    }
}

export class UserSerializer {
    fromJson(json: any): User { return new User(json); }
    toJson(data: any): any { return data; }
}
