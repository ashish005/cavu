import {CoreResource} from "@app-global";

export class WorkflowUserGroupRule {
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

export class WorkflowOrgColumnFilterLookup {
    id: string;
    name: string;
    userTypeId: number;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;
    }
}

export class WorkflowTaskOrgUserGroupLookup {
    id: string;
    name: string;
    categoryId: number;
    rules: Array<WorkflowUserGroupRule>;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.categoryId = model.categoryId;
        this.rules =  (model.rules || []).map(r => new WorkflowUserGroupRule(r));
    }
}

export class WorkflowTaskUserGroupCategoryLookup {
    id: string;
    name: string;
    groups: Array<WorkflowTaskOrgUserGroupLookup>;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.groups = (model.groups || []).map(r => new WorkflowTaskOrgUserGroupLookup(r));
    }
}

export class WorkflowTaskNotificationTypeLookup {
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

class WorkflowNotificationUserTypeLookup {
    id: string;
    name: string;
    masterType: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
    }
}

export class WorkflowTemplateMediaTypeLookup {
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

class WorkflowTaskTypeLookup {
    id: string;
    name: string;
    masterType: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
    }
}

export class WorkflowOrgProcessLookup {
    id: number | string;
    name: string;
    masterType: string;
    parentId: number;
    sortOrder: number;
    childItems:  Array<WorkflowOrgProcessLookup>;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.parentId = model.parentId;
        this.sortOrder = model.sortOrder;
        this.childItems = (model.childItems || []).map(r => new WorkflowOrgProcessLookup(r));
    }
}

class WorkflowFrequencyTypeLookup {
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

export class WorkflowProjectPhaseLookup {
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

export class WorkflowProjectStatusTypeLookup {
    id: number;
    name: string;
    sortOrder: number;
    projectPhases: Array<WorkflowProjectPhaseLookup>;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder } = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.projectPhases = [];
    }
}

export class WorkflowProcessPhaseLookup {
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
export class WorkflowProcessStatusLookup {
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

export class WorkflowTaskPriorityLookup {
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
export class WorkflowTaskStatusLookup {
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

export class WorkflowPluginLookup extends CoreResource {
    taskTypes: Array<WorkflowTaskTypeLookup> = [];
    orgProcess: Array<WorkflowOrgProcessLookup> = [];
    frequencyTypes: Array<WorkflowFrequencyTypeLookup> = [];
    mediaTypes: Array<WorkflowTemplateMediaTypeLookup> = [];
    userTypes: Array<WorkflowNotificationUserTypeLookup> = [];
    notificationTypes: Array<WorkflowTaskNotificationTypeLookup> = [];

    categories: Array<WorkflowTaskUserGroupCategoryLookup> = [];
    groups: Array<WorkflowTaskOrgUserGroupLookup> = [];
    columnFilters: Array<WorkflowOrgColumnFilterLookup> ;

    processPhases: Array<WorkflowProcessPhaseLookup>;
    processStatus: Array<WorkflowProcessStatusLookup>;
    taskPriorities: Array<WorkflowTaskPriorityLookup>;
    taskStatus: Array<WorkflowTaskStatusLookup>;

    projectPhases: Array<WorkflowProjectPhaseLookup> = [];
    projectStatusTypes: Array<WorkflowProjectStatusTypeLookup> = [];

    orgProcessMapping: any;
    constructor(model: any = <any>{}){
        super();
        const {
            taskTypes, orgProcess, frequencyTypes, mediaTypes,
            userTypes, notificationTypes, categories, columnFilters, processPhases, processStatus, taskPriorities,
            taskStatus, projectPhases, projectStatusTypes
        } = model;
        this.taskTypes = (taskTypes || []).map(r => new WorkflowTaskTypeLookup(r));
        this.orgProcess = (orgProcess || []).map(r => new WorkflowOrgProcessLookup(r));
        this.frequencyTypes = (frequencyTypes || []).map(r => new WorkflowFrequencyTypeLookup(r));
        this.mediaTypes = (mediaTypes || []).map(r => new WorkflowTemplateMediaTypeLookup(r));
        this.userTypes = (userTypes || []).map(r => new WorkflowNotificationUserTypeLookup(r));
        this.notificationTypes = (notificationTypes || []).map(r => new WorkflowTaskNotificationTypeLookup(r));

        this.categories = (categories || []).map(r => new WorkflowTaskUserGroupCategoryLookup(r));
        this.columnFilters = (columnFilters || []).map(r => new WorkflowOrgColumnFilterLookup(r));

        this.processStatus = (processStatus || []).map(r => new WorkflowProcessStatusLookup(r));
        this.processPhases = (processPhases || []).map(r => new WorkflowProcessPhaseLookup(r));

        this.taskPriorities = (taskPriorities || []).map(r => new WorkflowTaskPriorityLookup(r));
        this.taskStatus = (taskStatus || []).map(r => new WorkflowTaskStatusLookup(r));

        this.projectPhases = (projectPhases || []).map(r => new WorkflowProjectPhaseLookup(r));
        this.projectStatusTypes = (projectStatusTypes || []).map(r => new WorkflowProjectStatusTypeLookup(r));

        this.groups = (this.categories).reduce((result, curr)=>{
            result = result.concat(...curr.groups);
            return result;
        }, []);

        const redueProcess = (result, curr)=>{
            result[curr.id] = { id: curr.id, parentId: curr.parentId };
            (curr.childItems || []).reduce(redueProcess, result);
            return result;
        };
        this.orgProcessMapping = this.orgProcess.reduce(redueProcess, {});

        this.projectStatusTypes.map(r => {
            const statuses = this.projectPhases.filter(k => k.statusTypeId == r.id);
            r.projectPhases.push(...statuses);
        });
    }

    getFiltersByUserTypeId(userTypeId)
    {
        return (this.columnFilters || []).filter(r => r.userTypeId == userTypeId);
    }

    getAllOrgProcessByRootProcessId(processId: number){
        return (this.orgProcess || []).filter(r  => r.id == processId);
    }

    getAllOrgProcessByRootProcessMaster(processType: string){
        return (this.orgProcess || []).filter(r  => r.masterType == processType);
    }
}

export class WorkflowPluginLookupSerializer {
    fromJson(json: any): WorkflowPluginLookup { return new WorkflowPluginLookup(json); }
    toJson(data: any): any { return {}; }
}
