import {CoreQueryOptions, CoreResource} from "@app-global";

export class TeamUserGroupQueryOptions extends CoreQueryOptions {
    userMasterType: string;

    override toQueryString() {
        const obj = {
            userMasterType: this.userMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class TeamUserGroupRule {
    id: string;
    userFilterTypeId: number;
    userGroupId: number;
    userTypeId: number; // Just to manage internally
    operator: string;
    value: string;
    valueId: string;
    min: string;
    max: string;
    isActive: boolean;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.userTypeId = model.userTypeId; // Just to manage internally
        this.userFilterTypeId = model.userFilterTypeId;
        this.userGroupId = model.userGroupId;
        this.operator = model.operator;
        this.value = model.value;
        this.valueId = model.valueId;
        this.min = model.min;
        this.max = model.max;
        this.isActive = model.isActive;
    }
}

export class TeamUserGroup extends CoreResource {
    //id: string;
    name: string;
    categoryId: number;
    categoryName: string;
    userTypeId: number; //Just to filter out rules

    hasDynamicRules: boolean;
    rules: Array<TeamUserGroupRule>;
    totalRules: number;
    userTypeName: string;
    isActive: boolean;
    isLocked: boolean;
    constructor(model: any = <any>{}){
        super();
        const { id, name, categoryId, categoryName, userTypeId, hasDynamicRules, rules, totalRules, userTypeName, isActive, isLocked} = model;
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userTypeId = userTypeId;
        this.hasDynamicRules = hasDynamicRules;
        this.rules = (rules || []).map(r => new TeamUserGroupRule(r));
        this.totalRules = totalRules;
        this.userTypeName = userTypeName;
        this.isActive = isActive;
        this.isLocked = isLocked;
    }
}

export class TeamUserGroupSerializer {
    fromJson(json: any): TeamUserGroup { return new TeamUserGroup(json); }

    toJson(client: any): any {
        client.rules = (client.rules || []).filter(r => r.valueId).map(r => {
            return {
                id: r.id,
                userFilterTypeId: r.userFilterTypeId,
                operator: r.operator,
                value: r.value,
                valueId: r.valueId,
                min: r.min,
                max: r.max
            };
        });
        return client;
    }
}
