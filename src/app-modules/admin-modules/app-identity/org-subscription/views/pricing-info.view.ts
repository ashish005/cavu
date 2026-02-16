import {Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgLicense} from "../domains/org-license.serializer";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, CoreEndpointBase} from "@app-global";
import {SoftwareInvoicePrintView} from "../components/software-invoice-print.view";
import {PaymentService} from "../services/payment.service";

@Component({
    standalone: false,
  templateUrl: './templates/pricing-info.html'
})
export class PricingInfoView extends CoreEndpointBase implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    license: OrgLicense;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                private sharedService: SharedService,
                public override injector: Injector, public paymentService: PaymentService) { super(injector); }

    ngOnInit(){
        const success = (r: { data: OrgLicense })=>
        {
            this.license = new OrgLicense(r.data);
        };
        this.paymentService.getLicenseInfoEndpoint().toPromise().then(success);
    }

    showMyLicense(){
        const { license } = this.orgSetup;
        const inputData: any = {
            data: license
        };
        const popupHeaderOptions = {text: `${license.licenseNo}`, desc: '' };
        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };

        const popupOptions = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        this.sharedService.showCustomPopup(SoftwareInvoicePrintView, popupOptions, inputData).then(onSuccess, onFailure);
    }
}
