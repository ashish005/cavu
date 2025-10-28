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
    }
}

export class TeamUserGroup extends CoreResource {
    //id: string;
    name: string;
    categoryId: number;
    userTypeId: number; //Just to filter out rules
    categoryName: string;
    hasDynamicRules: boolean;
    rules: Array<TeamUserGroupRule>;
    constructor(model: any = <any>{}){
        super();
        const { id, name, categoryId, categoryName, userTypeId, hasDynamicRules, rules} = model;
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userTypeId = userTypeId;
        this.hasDynamicRules = hasDynamicRules;
        this.rules = (rules || []).map(r => new TeamUserGroupRule(r));
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
