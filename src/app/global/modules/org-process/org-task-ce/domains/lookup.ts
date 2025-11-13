import {CoreResource} from "../../../../core-setup/index";

export class EventUserGroupRule {
    id: string;
    userFilterTypeId: number;
    userTypeId: number;
    operator: string;
    value: string;
    valueId: string;
    min: string;
    max: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.userFilterTypeId = model.userFilterTypeId;
        this.userTypeId = model.userTypeId;
        this.operator = model.operator;
        this.value = model.value;
        this.valueId = model.valueId;
        this.min = model.min;
        this.max = model.max;
    }
}

export class EventOrgColumnFilterLookup {
    id: string;
    name: string;
    userTypeId: number;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;
    }
}

export class EventTaskOrgUserGroupLookup {
    id: string;
    name: string;
    categoryId: number;
    rules: Array<EventUserGroupRule>;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.categoryId = model.categoryId;
        this.rules =  (model.rules || []).map(r => new EventUserGroupRule(r));
    }
}

export class EventTaskUserGroupCategoryLookup {
    id: string;
    name: string;
    groups: Array<EventTaskOrgUserGroupLookup>;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.groups = (model.groups || []).map(r => new EventTaskOrgUserGroupLookup(r));
    }
}

export class EventTaskNotificationTypeLookup {
    id: string;
    name: string;
    masterType: string;
    userTypeId: number;
    isLocked: boolean;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.userTypeId = model.userTypeId;
        this.isLocked = model.isLocked;
    }
}

class EventNotificationUserTypeLookup {
    id: string;
    name: string;
    masterType: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
    }
}

export class EventTemplateMediaTypeLookup {
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

class EventTaskTypeLookup {
    id: string;
    name: string;
    masterType: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
    }
}

export class EventOrgProcessLookup {
    id: number | string;
    name: string;
    masterType: string;
    parentId: number;
    sortOrder: number;
    childItems:  Array<EventOrgProcessLookup>;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.parentId = model.parentId;
        this.sortOrder = model.sortOrder;
        this.childItems = (model.childItems || []).map(r => new EventOrgProcessLookup(r));
    }
}

class EventFrequencyTypeLookup {
    id: number;
    name: string;
    masterType: string;
    isFeeType: boolean;
    isPeriodType: boolean;

    constructor(model: any = <any>{}){
        const {id, name, masterType, isFeeType, isPeriodType} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.isFeeType = isFeeType;
        this.isPeriodType = isPeriodType;
    }
}

export class EventProjectPhaseLookup {
    id: number;
    name: string;
    sortOrder: number;
    statusTypeId: number;
    statusTypeName: string;

    constructor(model: any = <any>{}){
        const {id, name, sortOrder, statusTypeId, statusTypeName} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.statusTypeId = statusTypeId;
        this.statusTypeName = statusTypeName;
    }
}

export class EventProjectStatusTypeLookup {
    id: number;
    name: string;
    sortOrder: number;
    projectPhases: Array<EventProjectPhaseLookup>;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder } = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.projectPhases = [];
    }
}

export class EventProcessPhaseLookup {
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
export class EventProcessStatusLookup {
    id: number;
    name: string;
    sortOrder: number;

    constructor(model: any = <any>{}){
        const {id, name, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
    }
}

export class EventTaskPriorityLookup {
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
export class EventTaskStatusLookup {
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

export class EventTaskPluginLookup extends CoreResource {
    taskTypes: Array<EventTaskTypeLookup> = [];
    orgProcess: Array<EventOrgProcessLookup> = [];
    frequencyTypes: Array<EventFrequencyTypeLookup> = [];
    //mediaTypes: Array<EventTemplateMediaTypeLookup> = [];
    userTypes: Array<EventNotificationUserTypeLookup> = [];
    //notificationTypes: Array<EventTaskNotificationTypeLookup> = [];

    categories: Array<EventTaskUserGroupCategoryLookup> = [];
    groups: Array<EventTaskOrgUserGroupLookup> = [];
    columnFilters: Array<EventOrgColumnFilterLookup> ;

    //processPhases: Array<EventProcessPhaseLookup>;
    //processStatus: Array<EventProcessStatusLookup>;
    taskPriorities: Array<EventTaskPriorityLookup>;
    taskStatus: Array<EventTaskStatusLookup>;

    // projectPhases: Array<EventProjectPhaseLookup> = [];
    // projectStatusTypes: Array<EventProjectStatusTypeLookup> = [];
    //
    // orgProcessMapping: any;
    constructor(model: any = <any>{}){
        super();
        const {
            taskTypes, orgProcess, frequencyTypes, mediaTypes,
            userTypes, notificationTypes, categories, columnFilters, processPhases, processStatus, taskPriorities,
            taskStatus, projectPhases, projectStatusTypes
        } = model;
        this.taskTypes = (taskTypes || []).map(r => new EventTaskTypeLookup(r));
        this.orgProcess = (orgProcess || []).map(r => new EventOrgProcessLookup(r));
        this.frequencyTypes = (frequencyTypes || []).map(r => new EventFrequencyTypeLookup(r));
        //this.mediaTypes = (mediaTypes || []).map(r => new EventTemplateMediaTypeLookup(r));
        this.userTypes = (userTypes || []).map(r => new EventNotificationUserTypeLookup(r));
        //this.notificationTypes = (notificationTypes || []).map(r => new EventTaskNotificationTypeLookup(r));

        this.categories = (categories || []).map(r => new EventTaskUserGroupCategoryLookup(r));
        this.columnFilters = (columnFilters || []).map(r => new EventOrgColumnFilterLookup(r));

        // this.processStatus = (processStatus || []).map(r => new EventProcessStatusLookup(r));
        // this.processPhases = (processPhases || []).map(r => new EventProcessPhaseLookup(r));

        this.taskPriorities = (taskPriorities || []).map(r => new EventTaskPriorityLookup(r));
        this.taskStatus = (taskStatus || []).map(r => new EventTaskStatusLookup(r));

        // this.projectPhases = (projectPhases || []).map(r => new EventProjectPhaseLookup(r));
        // this.projectStatusTypes = (projectStatusTypes || []).map(r => new EventProjectStatusTypeLookup(r));

        this.groups = (this.categories).reduce((result, curr)=>{
            result = result.concat(...curr.groups);
            return result;
        }, []);

        // const redueProcess = (result, curr)=>{
        //     result[curr.id] = { id: curr.id, parentId: curr.parentId };
        //     (curr.childItems || []).reduce(redueProcess, result);
        //     return result;
        // };
        // this.orgProcessMapping = this.orgProcess.reduce(redueProcess, {});
        //
        // this.projectStatusTypes.map(r => {
        //     const statuses = this.projectPhases.filter(k => k.statusTypeId == r.id);
        //     r.projectPhases.push(...statuses);
        // });
    }

    getFiltersByUserTypeId(userTypeId)
    {
        return (this.columnFilters || []).filter(r => r.userTypeId == userTypeId);
    }

    getAllOrgProcessByRootProcessId(processId: number){
        return (this.orgProcess || []).filter(r  => r.id == processId);
    }

    /*getAllOrgProcessByRootProcessMaster(processType: string){
        return (this.orgProcess || []).filter(r  => r.masterType == processType);
    }*/
}

export class EventTaskPluginLookupSerializer {
    fromJson(json: any): EventTaskPluginLookup { return new EventTaskPluginLookup(json); }
    toJson(data: any): any { return {}; }
}
