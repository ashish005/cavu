import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {ACTION_ENUM, DynamicComponent} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComplianceReportService} from "../services/report.service";

@Component({
  standalone: false,
    selector: '[compStatusChange]',
    template: `<div class="text-center b-a box-shadow">
        <span class="px-2"><small>{{ data.netPaidAmount | orgCurrency }}</small></span>
        <div class="float-right">
            <a class="text-primary btn btn-xs text-xs _400"
            [class]="{ 'hidden': !data.complianceDetailId }" [ngbPopover]="content" placement="auto" container="body" triggers="manual"
           [autoClose]="false" #p="ngbPopover" (click)="p.toggle()">
            <i class="fa fa-star" [class]="{ 'text-warning': (data.complianceStatusName == 'Pending'), 'text-success': (data.complianceStatusName == 'Done')}"></i>
           </a>
        </div>
        <!--<div class="btn-group">
            <span>{{ data.netPaidAmount | orgCurrency }}</span>
            <button class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false"></button>
            <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-20px, 33px, 0px); top: 0px; left: 0px; will-change: transform;">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item">Separated link</a>
            </div>
        </div>-->
    </div>
<ng-template #content>
    <div class="w w-xxl" [formGroup]="customForm">
        <div class="flex" style="height: 200px; overflow-y: scroll;">
            <div class="row row-sm">
                <div class="col-4">
                    <div class="md-form-group">
                        <input class="md-input" formControlName="lastDueAmount" [ngClass]="{ 'is-invalid': submitted && f['lastDueAmount'].errors }">
                        <label> Last Due </label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="md-form-group">
                        <input class="md-input" formControlName="saleAmount" [ngClass]="{ 'is-invalid': submitted && f['saleAmount'].errors }">
                        <label> Sale Amount </label>
                    </div>
                </div>

                <div class="col-4">
                    <div class="md-form-group">
                        <input class="md-input" formControlName="taxAmount" [ngClass]="{ 'is-invalid': submitted && f['taxAmount'].errors }">
                        <label> Tax </label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="md-form-group">
                        <input class="md-input" formControlName="rebateAmount" [ngClass]="{ 'is-invalid': submitted && f['rebateAmount'].errors }">
                        <label> Rebate </label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="md-form-group">
                        <select class="md-input" formControlName="complianceStatus">
                            <ng-template ngFor let-entity [ngForOf]="statusEnum" let-i="index">
                                <option [value]="entity.id">{{entity.name}}</option>
                            </ng-template>
                        </select>
                        <label>Status</label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="md-form-group">
                        <input class="md-input" formControlName="netPayableAmount" [ngClass]="{ 'is-invalid': submitted && f['netPayableAmount'].errors }">
                        <label> Payable </label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="md-form-group">
                        <input class="md-input" formControlName="netPaidAmount" [ngClass]="{ 'is-invalid': submitted && f['netPaidAmount'].errors }">
                        <label> Paid </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="popover__controls d-flex justify-content-end">
        <button class="btn btn-xs btn-success text-xs mx-2" (click)="submitForm(p)">Apply</button>
        <button class="btn btn-xs btn-danger text-xs" (click)="p.close()">Cancel</button>
    </div>
</ng-template>`
})
export class ComplianceStatusActionCell extends DynamicComponent implements OnInit{
    @Input() data;
    submitted: boolean;
    customForm: FormGroup;

    statusEnum = [
        { 'id':1, 'name': 'Pending'},
        { 'id':2, 'name': 'Done'},
        { 'id':3, 'name': 'OnHold'}
    ];
    constructor(public fb: FormBuilder, public service: ComplianceReportService) {
        super();
        this.customForm = this.fb.group(<any>{
            complianceStatus: [null],
            lastDueAmount: [null],
            saleAmount: [null],
            taxAmount: [null],

            rebateAmount: [null],
            availableInputAmount: [null],
            netPayableAmount: [null],
            netPaidAmount: [null],

            empExecutiveId: [null],
            empExecutiveName: [null]
        });
    }

    ngOnInit(){
        this.customForm.patchValue(this.data);
    }

    get f() { return this.customForm.controls; }

    submitForm(p){
        // stop here if form is invalid
        if (this.customForm.invalid) { return; }
        this.submitted = true;

        const val = this.customForm.value;
        this.service.update(this.data.complianceDetailId, val).subscribe((resp: any) => {
            this.submitted = false;
            p.close();
            this.service.refreshReportGrid.emit(true);
        }, ()=>{ this.submitted = false; p.close(); });
    }
}
