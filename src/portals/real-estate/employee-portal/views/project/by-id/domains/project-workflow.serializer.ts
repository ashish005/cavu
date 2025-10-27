import {CoreQueryOptions, CoreResource} from "@app-global";
import {ProjectTask} from "./project-task.serializer";


export class ProjectWorkflowQueryOptions extends CoreQueryOptions{
    customerId: string;
    projectId: string;
    moduleId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            customerId: this.customerId,
            projectId: this.projectId,
            moduleId: this.moduleId,
            processMasterType: 'PROJECT_MANAGEMENT'
        };
        return super.getParamByObject(obj);
    }
}

export class ProjectWorkflow extends CoreResource
{
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
    children: Array<ProjectWorkflow>;
    tasks: Array<ProjectTask>;
    //userAudit: UserAuditInfo;
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
        this.processStartDate = (processStartDate) ? processStartDate: null;
        this.processEndDate = (processEndDate)? processEndDate: null;

        this.startPhaseId = startPhaseId;
        this.endPhaseId = endPhaseId;
        this.startPhaseName = startPhaseName;
        this.endPhaseName = endPhaseName;

        this.sortOrder = sortOrder;
        this.isCompleted = isCompleted;
        this.isStarted = isStarted;

        //this.orgProcess = new OrgProcess(orgProcess || {});
        //this.status = status;
        this.children = (children || []).map(r => new ProjectWorkflow(r));
        this.tasks = (tasks || []).map(r => new ProjectTask(r));
        //this.userAudit = new UserAuditInfo(userAuditInfo);
    }
}

export class ProjectWorkflowSerializer {
  fromJson(json: any): ProjectWorkflow { return new ProjectWorkflow(json); }
  toJson(model: any): any {return model;}
}
