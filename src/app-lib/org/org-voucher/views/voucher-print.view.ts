import {
    Component, Input, OnDestroy, OnInit, Renderer2, ViewChild
} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {VoucherService} from "../services/voucher.service";

@Component({
    standalone: false,
    templateUrl: './templates/voucher-print.html',
    selector: 'voucher-print',
    styles: [`:host { display: contents; } 
    .apply-padding { padding: 1rem!important; }
    @media print { .apply-padding { padding: 0px !important; } }
`] })
export class VoucherPrintView implements OnInit, OnDestroy {
    @ViewChild('docPrint', { static: true }) docPrint;
    @Input() data: { voucherId, voucherMasterType };
    @Input() showPrintOptions:boolean = false;

    pdfOptionsList: Array<any>;
    pdfOptionsSubscription: Subscription;

    activeInvoice: any;
    isLoading: boolean;
    constructor(public service: VoucherService, public renderer: Renderer2, public sanitizer: DomSanitizer) {}

    ngOnInit() {
        if(this.data){
            this.syncPopulateReport(null, this.data);
        }
    }

    syncPopulateReport(key: string, data) {
        this.getPdfReportOptions();
        this.showReport(data, null);
    }

    ngOnDestroy(){ this.pdfOptionsSubscription?.unsubscribe(); }

    changeInvoice(invoice) {
        this.activeInvoice = invoice;
        this.showReport(this.data, invoice.key);
    }

    getPdfReportOptions(){
        this.isLoading = true;
        const failure = (resp)=> { this.isLoading = false; };
        const pdfOptionsSuccess = (resp)=> { this.isLoading = false; this.pdfOptionsList = resp.entities; };
        this.pdfOptionsSubscription = this.service.getPdfReportOptions().subscribe(pdfOptionsSuccess, failure);
    }

    showReport(data: { voucherId, voucherMasterType }, key)
    {
        const { voucherId, voucherMasterType } =  data;
        this.docPrint.populateReportByKey(key, voucherId, voucherMasterType);
    }

    printPage() { this.docPrint.printPage(); }

    downloadPdf() {
        const { voucherId, voucherMasterType } =  this.data;
        this.docPrint.downloadPdf(voucherId, voucherMasterType);
    }

    public populateReport(data: { voucherId, voucherMasterType }, key)
    {
        this.data = data;
        this.syncPopulateReport(key, data);
    }

}