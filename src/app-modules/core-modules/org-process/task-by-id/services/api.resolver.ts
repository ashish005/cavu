import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {OrgResourceService} from "@app-global";
import {TaskLookup, TaskLookupSerializer} from "../domains/task.lookup";
import {TaskSummaryRow, TaskSummaryRowSerializer} from "../domains/task-summary.serializer";

@Injectable()
export class TaskAPIResolver extends OrgResourceService<TaskLookup> implements Resolve<any> {
    masterType: TaskLookup;
    constructor(public override injector: Injector) { super(injector, 'pipelineLookup/taskById', new TaskLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const success = (results) => { this.masterType = results.data; };
        const failure = (err: any) => {};
        //const endpoint = `${route.params.projectId}`;
        const setup = super.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}

@Injectable()
export class TaskByIdAPIResolver extends OrgResourceService<TaskSummaryRow> implements Resolve<any> {
    data: TaskSummaryRow;
    constructor(public override injector: Injector) { super(injector, 'orgTask', new TaskSummaryRowSerializer()); }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const success = (results) => { this.data = results.data; };
        const failure = (err: any) => {};
        const { taskId } = route.params;
        const setup = super.read(`${taskId}`);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    showSchedulerPopup(inputData, popupHeaderOption, cb){
        // const success = (resp: any) => { this.pluginFactory.destroy(); cb(); };
        // const failure = (err)=> { this.pluginFactory.destroy(); };
        // this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showEventTaskSchedulerPopup(inputData, popupHeaderOption){
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (resp: any) => { this.pluginFactory.destroy();  };
        // this.pluginFactory.showEventTaskSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    }
}
