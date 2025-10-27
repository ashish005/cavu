import {CoreResource} from "@app-global";

class LookupNotificationType {
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
class LookupMediaType {
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

export class LookupUserGroup {
    id: string;
    name: string;
    categoryId: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.categoryId = model.categoryId;

    }
}
class LookupUserGroupCategory {
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
class LookupUserType {
    id: string;
    name: string;
    masterType: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType.toLowerCase();
    }
}
class LookupColumnFilter {
    id: string;
    name: string;
    userTypeId: number;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;
    }
}

class LookupTaskPriority {
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    color: string;

    constructor(model: any = <any>{}){
        const {id, name, description, sortOrder, isDefault, color} = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.color = color;
    }
}
class LookupTaskStatus {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    color: string;

    constructor(model: any = <any>{}){
        const {id, name, description, sortOrder, isDefault, color} = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.color = color;
    }
}

export class TaskLookup extends CoreResource {
    taskPriorities: Array<LookupTaskPriority>;
    taskStatus: Array<LookupTaskStatus>;

    mediaTypes: Array<LookupMediaType> = [];
    notificationTypes: Array<LookupNotificationType> = [];

    userTypes: Array<LookupUserType> = [];
    categories: Array<LookupUserGroupCategory> = [];
    userGroups: Array<LookupUserGroup> = [];
    columnFilters: Array<LookupColumnFilter> ;
    constructor(model: any = <any>{}){
        super();
        const {
            taskPriorities, taskStatus,
            mediaTypes, userTypes, notificationTypes, categories, columnFilters, userGroups
        } = model;
        this.taskPriorities = (taskPriorities || []).map(r => new LookupTaskPriority(r));
        this.taskStatus = (taskStatus || []).map(r => new LookupTaskStatus(r));

        this.mediaTypes = (mediaTypes || []).map(r => new LookupMediaType(r));
        this.notificationTypes = (notificationTypes || []).map(r => new LookupNotificationType(r));

        // this.userTypes = (userTypes || []).map(r => new LookupUserType(r));
        // this.categories = (categories || []).map(r => new LookupUserGroupCategory(r));
        // this.columnFilters = (columnFilters || []).map(r => new LookupColumnFilter(r));

        this.userGroups = (userGroups || []).map(r => new LookupUserGroup(r));
    }
}

export class TaskLookupSerializer {
    fromJson(json: any): TaskLookup { return new TaskLookup(json); }
    toJson(data: any): any { return null; }
}
