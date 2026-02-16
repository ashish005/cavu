import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrgLookupService, VOUCHER_TYPES} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class TrxnLayout implements OnInit, OnDestroy {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    hideSidebar: boolean;
    vTypeMapper: any;

    asideData: any;
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public lookupService: OrgLookupService){
    }

    ngOnInit() {
        const translatePath = '';//this.activatedRoute.snapshot.data.translatePath;
        this.vTypeMapper = this.lookupService.getVoucherTypeDictionary();

        this.asideData = {
            title: `${translatePath}.title`,
            navList: [
                {
                    key: `${translatePath}.nav.sale_group`, sortOrder: 1,
                    children:[
                        { routeTo: [VOUCHER_TYPES.SALE], icon:"", code:"FIN_DAY", key: this.vTypeMapper[VOUCHER_TYPES.SALE]?.name },
                        { routeTo: [VOUCHER_TYPES.SALE_RETURN], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.SALE_RETURN]?.name },
                        { routeTo: [VOUCHER_TYPES.QUOTATION], icon:"", code:"FIN_ACB", key: this.vTypeMapper[VOUCHER_TYPES.QUOTATION]?.name }
                    ]
                },
                {
                    key: `${translatePath}.nav.purchase_group`, sortOrder: 2,
                    children:[
                        { routeTo: [VOUCHER_TYPES.PURCHASE], icon:"", code:"FIN_DAY", key: this.vTypeMapper[VOUCHER_TYPES.PURCHASE]?.name },
                        { routeTo: [VOUCHER_TYPES.PURCHASE_RETURN], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.PURCHASE_RETURN]?.name }
                    ]
                },
                {
                    key: `${translatePath}.nav.accounting_group`, sortOrder: 3,
                    children:[
                        { routeTo: [VOUCHER_TYPES.CONTRA], icon:"", code:"FIN_DAY", key: this.vTypeMapper[VOUCHER_TYPES.CONTRA]?.name },
                        { routeTo: [VOUCHER_TYPES.JOURNAL], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.JOURNAL]?.name },
                        { routeTo: [VOUCHER_TYPES.RECEIPT], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.RECEIPT]?.name },
                        { routeTo: [VOUCHER_TYPES.PAYMENT], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.PAYMENT]?.name }
                    ]
                },
                {
                    key: `${translatePath}.nav.b2b_group`, sortOrder: 4,
                    children:[
                        { routeTo: [VOUCHER_TYPES.CREDIT_NOTE], icon:"", code:"FIN_DAY", key: this.vTypeMapper[VOUCHER_TYPES.CREDIT_NOTE]?.name },
                        { routeTo: [VOUCHER_TYPES.DEBIT_NOTE], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.DEBIT_NOTE]?.name }
                    ]
                },
                {
                    key: `${translatePath}.nav.order_group`, sortOrder: 5,
                    children:[
                        { routeTo: [VOUCHER_TYPES.SALE_ORDER], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.SALE_ORDER]?.name },
                        { routeTo: [VOUCHER_TYPES.PURCHASE_ORDER], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.PURCHASE_ORDER]?.name }
                    ]
                },
            ]
        };
    }
    ngOnDestroy(){}
    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    exportToPDF(){
        //this.apiResolver.generateFile();
        //this.sharedService.JSONToCSVConvertor(this.gridData, 'Finance : ' + this.pageTitle, true, true);
    }

    exportToExcel(){
        //this.sharedService.JSONToCSVConvertor(this.gridData, 'Finance : ' + this.pageTitle, true, true);
    }
}
