import {Component} from "@angular/core";
import {AlertService, DynamicComponent} from "@app-global";
import {DriverPayoutService} from "../services/driver.service";

@Component({
    template: `<div>
        <div *ngIf="!context.hasPayslip" class="btn btn-xs text-danger" (click)="generatePayslip()"><small>Generate</small></div>
        <div *ngIf="context.hasPayslip">Generated</div>
    </div>`, standalone: false
})
export class PayslipCellComponent extends DynamicComponent{
    constructor(private service: DriverPayoutService, private alertService: AlertService){ super(); }

    generatePayslip() {
        const success = (resp)=> {
            this.alertService.stopLoadingMessage();
            this.service.refresh$.emit(true);
            //this.context.hasPayslip = (resp.data );
        };
        const failure = (resp)=> {
            this.alertService.stopLoadingMessage();
        };
        this.alertService.startLoadingMessage('Progress', `Generating Payslip...`);
        this.service.generatePayslip(this.context.id).subscribe(success, failure);
    }
}

@Component({
    template: `
    <div *ngIf="context.hasPayslip">
        <span class="text-success" *ngIf="context.balance == 0">Paid</span>
        <span class="text-warning" *ngIf="context.balance > 0">Unpaid</span>
        <div *ngIf="context.balance > 0" class="btn btn-xs text-danger" (click)="makePayment()"><small>Pay</small></div>
    </div>`, standalone: false
})
export class VehiclePaymentCellComponent extends DynamicComponent{
    constructor(private service: DriverPayoutService, private alertService: AlertService){ super(); }

    makePayment() {
        /*this.fleetPluginFactory.showDriverPayPopup({ id: this.context.id }, { text: `Payment`, desc: `Payment` }, ()=> {
            this.service.refresh$.emit(true);
        });*/
        /*const success = (resp)=> { this.alertService.stopLoadingMessage(); };
        const failure = ()=> { this.alertService.stopLoadingMessage(); };
        this.alertService.startLoadingMessage('Progress', `Payment initiated...`);
        this.service.makePayment(this.context.id).subscribe(success, failure);*/
    }
}
