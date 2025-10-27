import {CoreQueryOptions, CoreResource} from "@app-global";

export class TeamGroupSearchQueryOptions extends CoreQueryOptions {
    operation: string;
    value: string;
    userType: string;
    masterType: string;

    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            operation:this.operation,
            value:this.value,
            userType: this.userType,
            masterType:this.masterType
        };
        return super.getParamByObject(obj);
    }
}

class UserGroupRule {
    id: string;
    userFilterTypeId: number;
    operator: string;
    value: string;
    min: string;
    max: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.userFilterTypeId = model.userFilterTypeId;
        this.operator = model.operator;
        this.value = model.value;
        this.min = model.min;
        this.max = model.max;
    }
}

export class OrgUserGroupLookup {
    id: string;
    name: string;
    categoryId: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.categoryId = model.categoryId;

    }
}

class OrgUserGroupCategory {
    id: number;
    name: string;
    hasDynamicRules: boolean;

    constructor(model: any = <any>{}) {
        const { id, name, hasDynamicRules} = model;
        this.id = id;
        this.name = name;
        this.hasDynamicRules = hasDynamicRules;
    }
}

class OrgNotificationType {
    id: string;
    name: string;
    masterType: string;
    userTypeId: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.userTypeId = model.userTypeId;
    }
}

class OrgNotificationUserType {
    id: string;
    name: string;
    masterType: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType.toLowerCase();
    }
}

class OrgTemplateMediaType {
    id: string;
    name: string;
    masterType: string;
    sortOrder: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.sortOrder = model.sortOrder;
    }
}

export class ColumnFilterLookup {
    id: string;
    name: string;
    userTypeId: number;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;
    }
}

export class TeamSetupLookup extends CoreResource{
    mediaTypes: Array<OrgTemplateMediaType> = [];
    userTypes: Array<OrgNotificationUserType> = [];
    notificationTypes: Array<OrgNotificationType> = [];
    categories: Array<OrgUserGroupCategory> = [];
    userGroups: Array<OrgUserGroupLookup> = [];
    columnFilters: Array<ColumnFilterLookup> ;
    constructor(model: any = <any>{}){
        super();
        const {mediaTypes, userTypes, notificationTypes, categories, columnFilters, userGroups} = model;
        this.mediaTypes = (mediaTypes || []).map(r => new OrgTemplateMediaType(r));
        this.userTypes = (userTypes || []).map(r => new OrgNotificationUserType(r));
        this.notificationTypes = (notificationTypes || []).map(r => new OrgNotificationType(r));
        this.categories = (categories || []).map(r => new OrgUserGroupCategory(r));
        this.columnFilters = (columnFilters || []).map(r => new ColumnFilterLookup(r));
        this.userGroups = (userGroups || []).map(r => new OrgUserGroupLookup(r));
    }

    getFiltersByUserTypeId = (userTypeId)=> (this.columnFilters || []).filter(r=> r.userTypeId == userTypeId);
    getCategoryById=(categoryId)=> (this.categories || []).find(r=> r.id == categoryId);
}

export class TeamSetupLookupSerializer {
    fromJson(json: any): TeamSetupLookup {
        return new TeamSetupLookup(json);
    }

    toJson(data: any): any {
        return {};
    }
}
