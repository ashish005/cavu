import {Injectable, Injector, OnDestroy} from "@angular/core";
import {of, Subscription} from "rxjs";
import {OrgResourceService} from "../endpoint-base.service";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {FREQUENCY_TYPE} from "../../enums";
export class WorkflowPhaseStatusLookup {
    id: number;
    name: string;
    isDefault: boolean;

    constructor(model: any = <any>{}){
        const {id, name, isDefault, color} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
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

export class EventFrequencyTypeLookup {
    id: number;
    name: string;
    masterType: string;
    isDefault: boolean;
    isFeeType: boolean;
    isPeriodType: boolean;
    isOnEvent: boolean;
    isFixedTime: boolean;
    isMonthly: boolean;
    constructor(model: any = <any>{}){
        const {id, name, masterType, isDefault, isFeeType, isPeriodType, isOnEvent, isFixedTime, isMonthly} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.masterType = masterType;
        this.isFeeType = isFeeType;
        this.isPeriodType = isPeriodType;
        this.isOnEvent = isOnEvent;
        this.isFixedTime = isFixedTime;
        this.isMonthly = isPeriodType;
    }
}
export class WorkflowPluginLookup {
    id: number;
    phaseStatus: Array<WorkflowPhaseStatusLookup>;
    processStatus: Array<WorkflowProcessStatusLookup>;
    frequencyTypes: Array<EventFrequencyTypeLookup>;

    taskPriorities: Array<WorkflowTaskPriorityLookup>;
    taskStatus: Array<WorkflowTaskStatusLookup>;
    constructor(model: any = <any>{}){
        const { phaseStatus, processStatus, taskPriorities, taskStatus, frequencyTypes } = model;
        this.processStatus = (processStatus || []).map(r => new WorkflowProcessStatusLookup(r));
        this.phaseStatus = (phaseStatus || []).map(r => new WorkflowPhaseStatusLookup(r));
        this.taskPriorities = (taskPriorities || []).map(r => new WorkflowTaskPriorityLookup(r));
        this.taskStatus = (taskStatus || []).map(r => new WorkflowTaskStatusLookup(r));
        this.frequencyTypes = (frequencyTypes || []).map(r => new EventFrequencyTypeLookup(r));
    }
    public defaultFrequency=()=> (this.frequencyTypes || []).find(r => r.isDefault);
    public defaultTaskPriority=()=> (this.taskPriorities || []).find(r => r.isDefault);
    public getFeeFrequencies=()=> (this.frequencyTypes || []).filter(r => r.isFeeType);
}
class WorkflowPluginLookupSerializer {
    fromJson(json: any): WorkflowPluginLookup { return new WorkflowPluginLookup(json); }
    toJson(data: any): any { return {}; }
}
@Injectable({ providedIn: 'root' })
export class OrgWorkflowAPIResolver extends OrgResourceService<WorkflowPluginLookup> implements Resolve<any>{
    masterType: WorkflowPluginLookup;
    constructor(public override injector: Injector) { super(injector, `orgWorkflowLookup`, new WorkflowPluginLookupSerializer()); }
    resolve(route: ActivatedRouteSnapshot) { return this.lookupResolver(route.data); }
    lookupResolver(route) {
        return new Promise((resolve, reject) => {
            if(this.masterType) { return resolve(true); }
            const failure = (err: any) => { return reject(err); };
            const success = (results) => { this.masterType = new WorkflowPluginLookup(results.data); return resolve(true); };
            const setup = super.readLookup(super.apiVersion);
            return this.performRouteResolver(route.data, setup, success, failure);
        });
    }
}