import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from "@app-global";
import {LayoutExtension} from "../../layout-extension";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class InvoiceReportLayout extends LayoutExtension implements OnInit {
    get showTrialBalanceOption(){ return this.page?.code == 'FIN_TB';};
    public pageTitleTemplate: TemplateRef<any>;
    constructor(private router: Router,
                public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){ super();
        this.layout = this.activatedRoute.snapshot.data;
    }

    asideData: any = {
        title: 'Sale Report',
        navList: [
            {
                name: "Sale Analysis",
                children:[
                    { routeTo: ['by-day'], icon:"", code: "FIN_TB", name: "Daily" },
                    { routeTo: ['by-month'], icon:"", code: "FIN_TB", name: "Monthly" },

                    { routeTo: ['by-executive'], icon:"", code: "FIN_BS", name: "Sales Executivewise" },
                    { routeTo: ['by-payment'], icon:"", code: "FIN_PRL", name: "Paymentwise" },
                    { routeTo: ['by-product'], icon:"", code: "FIN_TB", name: "Productwise" },
                    { routeTo: ['sale-day-return'], icon:"", code: "FIN_TB", name: "Daily Return" }
                ]
            }
        ]
    };

    ngOnInit(){}
}
