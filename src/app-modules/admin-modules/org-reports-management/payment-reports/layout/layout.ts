import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "@app-global";
import {LayoutExtension} from "../../layout-extension";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class InvoiceReportLayout extends LayoutExtension implements OnInit {
    get showTrialBalanceOption(){ return this.page?.code == 'FIN_TB';};
    public pageTitleTemplate: TemplateRef<any>;
    constructor(public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){ super();
        this.layout = this.activatedRoute.snapshot.data;
    }

    asideData: any = {
        title: 'Payment Report',
        navList: [
            {
                name: "Payment Analysis",
                children:[
                    { routeTo: ['by-day'], icon:"", code: "FIN_TB", name: "Daily" },
                    { routeTo: ['by-month'], icon:"", code: "FIN_TB", name: "Monthly" },
                    { routeTo: ['by-mode'], icon:"", code: "FIN_TB", name: "Modewise" },
                    { routeTo: ['by-month'], icon:"", code: "FIN_TB", name: "Payables" }
                ]
            }
        ]
    };

    ngOnInit(){}
}
