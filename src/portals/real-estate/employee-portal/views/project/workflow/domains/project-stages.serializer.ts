import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProjectStagesQueryOptions extends CoreQueryOptions{
    accountId: string;
    projectId: string;
    moduleId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            accountId: this.accountId,
            projectId: this.projectId,
            moduleId: this.moduleId
        };
        return super.getParamByObject(obj);
    }
}

export class ProjectStages extends CoreResource
{
    name: string;
    moduleId: string;
    fromDate: string;
    toDate: string;

    statusTrackerId: number;
    statusType: string;
    statusTypeId: number;

    sortOrder: number;
    isCompleted: boolean;
    isStarted: boolean;

    constructor(model: any = <any>{}){
        super();
        const {id, name, moduleId,
            fromDate, toDate,
            statusTrackerId, statusType, statusTypeId,
            sortOrder, isCompleted, isStarted
        } = model;
        this.id = id;
        this.name = name;
        this.moduleId = moduleId;
        this.fromDate = fromDate? fromDate: null;
        this.toDate = toDate? toDate: null;

        this.statusTrackerId = statusTrackerId;
        this.statusType = statusType;
        this.statusTypeId = statusTypeId;

        this.sortOrder = sortOrder;
        this.isCompleted = isCompleted;
        this.isStarted = isStarted;
    }
}

export class ProjectStagesSerializer {
    fromJson(json: any): ProjectStages { return new ProjectStages(json); }
    toJson(data: any): any { return data; }
}
