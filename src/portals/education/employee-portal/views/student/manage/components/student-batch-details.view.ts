import {Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BatchCourseFeeService} from "../services/batch-course-fee.service";
import {BatchCourseFee, BatchCourseFeeQueryOptions} from "../domains/batch-course-fee.serializer";
import {StudentSummaryService} from "../services";
import {ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/student-batch-details.html',
    styles: [`:host{ display: contents; }`]
})
export class StudentBatchDetailsView extends ViewExtender<BatchCourseFee> implements OnInit {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Input() studentId: string;
    override coreState: BatchCourseFeeQueryOptions = new BatchCourseFeeQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public batchService: BatchCourseFeeService,
                public summaryService: StudentSummaryService) {
        super(activatedRoute, batchService);
    }

    ngOnInit() {
        this.coreState.studentId = this.studentId;
        super.populateGrid();
    }

    syncFeePlanWithChallan(row: BatchCourseFee) {
        const { feePlanId, id } = row;
        const inputData: any = { feePlanId: feePlanId, StudentBatchId: id };

        const success = (resp: any) => {
            this.isLoading = false;
            super.populateGrid();
            this.summaryService.refresh.emit(true);
        };
        const failure = (err: any) => {
            this.isLoading = false;
        };

        this.isLoading = true;
        this.batchService.syncBatchFee(inputData).toPromise().then(success, failure);
    }
}
