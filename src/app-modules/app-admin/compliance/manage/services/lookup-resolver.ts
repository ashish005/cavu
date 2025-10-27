import {Injectable, Injector} from "@angular/core";
import {Resolve} from "@angular/router";
import {catchError, Observable, Subject} from "rxjs";
import {ComplianceLookup, ComplianceLookupSerializer} from "../domains/compliance.lookup";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {ComplianceCeComponent} from "../components/compliance-ce.component";
import {ComplianceRegulatoryCeComponent} from "../components/compliance-regulatory-ce.component";
import {ComplianceTypeLayout} from "../components/compliance-type.component";

@Injectable()
export class ComplianceAPIResolver extends OrgResourceService<ComplianceLookup> implements Resolve<any> {
    masterType: ComplianceLookup;
    refreshGrid: Subject<boolean> = new Subject<boolean>();

    constructor(public override injector: Injector, protected sharedService: SharedService) {
        super(injector, 'complianceLookup', new ComplianceLookupSerializer());
    }

    resolve() {
        const success = (results) => {
            this.masterType = results['data'];
        };
        const failure = (err: any) => {
        };
        const setup = super.read(this.apiVersion);
        return this.performRouteResolver({name: 'Compliance'}, setup, success, failure);
    }

    showCompliancPopup(inputData, popupHeader, actionCb) {
        const success = (resp: any) => {
            this.sharedService.destroy();
            actionCb(resp);
        };
        const failure = () => {
            this.sharedService.destroy();
        };

        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        let modal$ = this.sharedService.showCustomPopup(ComplianceCeComponent, popup, inputData);
        modal$.then(success, failure);
    }

    showComplianceRegulatoryPopup(inputData, popupHeader, actionCb) {
        const success = (resp: any) => {
            this.sharedService.destroy();
            actionCb(resp);
        };
        const failure = () => {
            this.sharedService.destroy();
        };

        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        let modal$ = this.sharedService.showCustomPopup(ComplianceRegulatoryCeComponent, popup, inputData);
        modal$.then(success, failure);
    }

    showComplianceMasterTypePopup(inputData, popupHeader) {
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any) => {
            this.sharedService.destroy();
        };
        const failure = () => {
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ComplianceTypeLayout, popup, inputData);
        modal$.then(success, failure);
    }

    public updateComplianceScheduler(complianceId, schedulerData) {
        return this.httpClient
            .post(`${this.baseSectorAPIUrl}compliance/${complianceId}/scheduler`, schedulerData, this.requestHeaders)
            .pipe(
                catchError(
                    error => this.handleError(error, () => this.updateComplianceScheduler(complianceId, schedulerData))
                )
            );
    }

    // showSchedulerPopup(complianceId, inputData, popupHeaderOption) {
    //     const failure = (err) => this.pluginFactory.destroy();
    //     const schedulerSuccess = (resp: any) => this.pluginFactory.destroy();
    //
    //     const success = (resp: any) => this.updateComplianceScheduler(complianceId, resp).toPromise().then(schedulerSuccess, failure);
    //     this.pluginFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    // }

    showSchedulerPopup(complianceId, inputData, popupHeaderOption) {
        const failure = (err) => this.schedulerFactory.destroy();
        const schedulerSuccess = (resp: any) => this.schedulerFactory.destroy();

        const success = (resp: any) => this.updateComplianceScheduler(complianceId, resp).toPromise().then(schedulerSuccess, failure);
        this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    }
}
