import {Component, Injector, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrgLookupService} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/trxn-layout.html'
})
export class TrxnLayout implements OnInit, OnDestroy {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    hideSidebar: boolean;
    vTypeMapper: any;

    asideData: any;
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public lookupService: OrgLookupService){
        const translatePath = '';//this.activatedRoute.snapshot.data.translatePath;
        this.vTypeMapper = this.lookupService.getVoucherTypeDictionary();
        debugger
        this.asideData = {
            title: `${translatePath}.title`,
            navList: [
                {
                    key: `${translatePath}.nav.sale_group`,
                    children:[
                        { routeTo: ['sale'], icon:"", code:"FIN_DAY", key: this.vTypeMapper['SALE']?.name },
                        //{ routeTo: ['sale-order'], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.SALE_ORDER]?.name },
                        { routeTo: ['sale-return'], icon:"", code:"FIN_CASH", key: this.vTypeMapper['SALE_RETURN']?.name },
                        //{ routeTo: ['quote'], icon:"", code:"FIN_ACB", name: VOUCHER_TYPES.QUOTATION }
                    ]
                },
                {
                    key: `${translatePath}.nav.purchase_group`,
                    children:[
                        { routeTo: ['purchase'], icon:"", code:"FIN_DAY", key: this.vTypeMapper['PURCHASE']?.name },
                        //{ routeTo: ['purchase-order'], icon:"", code:"FIN_CASH", key: this.vTypeMapper[VOUCHER_TYPES.PURCHASE_ORDER]?.name },
                        { routeTo: ['purchase-return'], icon:"", code:"FIN_CASH", key: this.vTypeMapper['PURCHASE_RETURN']?.name }
                    ]
                },
                {
                    key: `${translatePath}.nav.accounting_group`,
                    children:[
                        { routeTo: ['contra'], icon:"", code:"FIN_DAY", key: this.vTypeMapper['CONTRA']?.name },
                        { routeTo: ['journal'], icon:"", code:"FIN_CASH", key: this.vTypeMapper['JOURNAL']?.name },

                        { routeTo: ['receipt'], icon:"", code:"FIN_CASH", key: this.vTypeMapper['RECEIPT']?.name },
                        { routeTo: ['payment'], icon:"", code:"FIN_CASH", key: this.vTypeMapper['PAYMENT']?.name }
                    ]
                },
                {
                    key: `${translatePath}.nav.b2b_group`,
                    children:[
                        { routeTo: ['credit-note'], icon:"", code:"FIN_DAY", key: this.vTypeMapper['CREDIT_NOTE']?.name },
                        { routeTo: ['debit-note'], icon:"", code:"FIN_CASH", key: this.vTypeMapper['DEBIT_NOTE']?.name }
                    ]
                }
            ]
        };
    }

    ngOnInit() {}
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
