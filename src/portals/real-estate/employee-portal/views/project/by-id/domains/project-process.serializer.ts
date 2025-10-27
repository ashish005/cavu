import {CoreQueryOptions, CoreResource} from "@app-global";
import {ProjectTask} from "./project-task.serializer";

export class ProjectProcessQueryOptions extends CoreQueryOptions{
    parentId: number | string;

    constructor(model: any = {}){
        super(model);
    }

    toQueryString (){
        const obj = {
            parentId:this.parentId
        };
        return super.getParamByObject(obj);
    }
}

export class ProjectProcess extends CoreResource {
  override id: any;
    name: string;
    moduleId: string;

    processStartDate: string;
    processEndDate: string;

    startPhaseId: number;
    endPhaseId: number;

    startPhaseName: string;
    endPhaseName: string;

    sortOrder: number;
    isCompleted: boolean;
    isStarted: boolean;
    children: Array<ProjectProcess>;
    tasks: Array<ProjectTask>;
    constructor(model: any = <any>{}){
        super();
        const {id,
            name, moduleId,
            processStartDate, processEndDate,
            startPhaseId, endPhaseId, startPhaseName, endPhaseName,
            sortOrder, isCompleted, isStarted,
            children, tasks,
            //userAuditInfo,

        } = model;
        this.id = id;
        this.name = name;
        this.moduleId = moduleId;
        this.processStartDate = processStartDate;
        this.processEndDate = processEndDate;

        this.startPhaseId = startPhaseId;
        this.endPhaseId = endPhaseId;
        this.startPhaseName = startPhaseName;
        this.endPhaseName = endPhaseName;

        this.sortOrder = sortOrder;
        this.isCompleted = isCompleted;
        this.isStarted = isStarted;

        //this.orgProcess = new OrgProcess(orgProcess || {});
        //this.status = status;
        this.children = (children || []).map(r => new ProjectProcess(r));
        this.tasks = (tasks || []).map(r => new ProjectTask(r));
        //this.userAudit = new UserAuditInfo(userAuditInfo);
    }
}

export class ProjectProcessSerializer {
  fromJson(json: any): ProjectProcess { return new ProjectProcess(json); }
  toJson(data: any): any { return data; }
}
