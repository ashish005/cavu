import {
    Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation
} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {SoftwareInvoiceReportService} from "../services/software-invoice-report.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppSetup, AppSetupService} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/software-invoice-print.html',
    providers: [SoftwareInvoiceReportService],
    styles: [`:host { display: contents; }`]
})
export class SoftwareInvoicePrintView  implements OnInit, OnDestroy {
    @ViewChild('docPrint', { static: true }) docPrint;
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    innerHTML: any;
    isLoading: boolean;
    info: { invoiceId: number, licenseId: number, licenseNo: string };
    @Input() set data(val) {
        this.info = val;
    }
    orgSetup: AppSetup;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public setupService: AppSetupService, public sanitizer: DomSanitizer) {
      this.orgSetup = setupService.appSetup;
    }

    ngOnInit() {
        this.showReport();
    }

    ngOnDestroy(){ }
    showReport()
    {
        const { invoiceId, licenseId, licenseNo } =  this.info;
        this.docPrint.showReport(invoiceId, licenseId);
    }

    printPage() { this.docPrint.printPage(); }

    downloadPdf() {
        const { invoiceId, licenseId, licenseNo } =  this.info;
        this.docPrint.downloadPdf(invoiceId, licenseId, licenseNo);
    }
}
