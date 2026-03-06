import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DynamicComponent} from "@app-global";
import {Batch} from "../domains/batch.serializer";

@Component({
    standalone: false,
    template: `<div><a class="btn btn-xs text-xs b-a" (click)="addFeePlan(context)"><i class="fa fa-fw fa-plus"></i> Fee Plan</a></div>`
})
export class CourseFeePlanGridCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) {
        super();
    }

    addFeePlan(row: Batch) {
        const {id, name, orgSessionId, studyModeTypeId} = row;
        const popupHeaderOption = {text: `Fee Plan for ${name}`, desc: `Fee Plan`};
        const inputData: any = {
            //id: id,
            data: {
                orgSessionId: orgSessionId,
                studyModeTypeId: studyModeTypeId
            }
        };
        // const success = (resp)=> {
        //     this.feePlanFactory.destroy();
        // };
        // const failure = (resp)=> {
        //     this.feePlanFactory.destroy();
        // };
        // this.feePlanFactory.feePlanCEPopup(inputData, popupHeaderOption).then(success, failure);
    }
}