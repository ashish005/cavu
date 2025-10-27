import {Component, OnInit} from "@angular/core";
import {AlertService, DynamicComponent} from "@app-global";
import {VehiclePayoutService} from "../services/vehicle.service";
import {VehicleAPIResolver} from "../services/api.resolver";

@Component({
    template: `<div>
        <div class="btn btn-xs text-xs" (click)="scheduleInspection()">Schedule</div>
        <div class="btn btn-xs text-xs" (click)="inspectionHistory()">History</div>
    </div>`,
  standalone: false
})
export class VehicleScheduleInspectionActionCell extends DynamicComponent{
    constructor(public apiResolver: VehicleAPIResolver){ super(); }

    scheduleInspection(){
        const inputData: any = {
            id: this.context.id,
            data: this.context
        };
        this.apiResolver.scheduleInspection(inputData, {text: `${this.context.vehicleNo}`, desc: '' }, ()=>{

        });
    }
    inspectionHistory(){
        const inputData: any = {
            id: this.context.id,
            data: this.context
        };
        this.apiResolver.showInspectionHistory(inputData, {text: `${this.context.vehicleNo}`, desc: '' }, ()=>{

        });
    }
}

@Component({
    template: `<div>
        <div *ngIf="!context.payslipId" class="btn btn-xs text-danger" (click)="generatePayslip()"><small>Generate</small></div>
        <div *ngIf="context.payslipId">Generated</div>
    </div>`,
  standalone: false
})
export class PayslipCellComponent extends DynamicComponent{
    constructor(private service: VehiclePayoutService, private alertService: AlertService){ super(); }

    generatePayslip() {
        const success = (resp)=> {
            this.alertService.stopLoadingMessage();
            this.service.refresh$.emit(true);
            //this.context.payslipId = resp.data;
        };
        const failure = (resp)=> {
            this.alertService.stopLoadingMessage();
        };
        this.alertService.startLoadingMessage('Progress', `Generating Payslip...`);
        this.service.generatePayslip(this.context.id).subscribe(success, failure);
    }
}

@Component({
    template: `<div *ngIf="context.payslipId">
        <span class="context.balance == 0">{{ context.paymentStatus }}</span>
        <div *ngIf="context.balance > 0" class="btn btn-xs text-danger" (click)="makePayment()"><small>Pay</small></div>
    </div>`,
  standalone: false
})
export class PaymentCellComponent extends DynamicComponent{
    constructor(private service: VehiclePayoutService, private alertService: AlertService//, private fleetPluginFactory: FleetPluginFactory
    ){ super(); }

    makePayment() {
        /*this.fleetPluginFactory.showVehiclePayPopup({ id: this.context.id }, { text: `Payment`, desc: `Payment` }, ()=> {
            this.service.refresh$.emit(true);
        });*/
        /*const success = (resp)=> {
            this.alertService.stopLoadingMessage();
            this.context.payslipId = resp.data;
        };
        const failure = (resp)=> {
            this.alertService.stopLoadingMessage();
        };
        this.alertService.startLoadingMessage('Progress', `Payment initiated...`);
        this.service.makePayment(this.context.id).subscribe(success, failure);*/
    }
}
