import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "@app-global";
import {LayoutExtension} from "./layout-extension";

@Component({
  standalone: false,
  templateUrl: './templates/report-layout.html'
})
export class ReportLayout extends LayoutExtension implements OnInit {
    get showTrialBalanceOption(){ return this.page?.code == 'FIN_TB';};
    public pageTitleTemplate: TemplateRef<any>;
    constructor(private router: Router,
                public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){
        super();
        this.layout = this.activatedRoute.snapshot.data;
    }

    asideData: any = {
        title: 'Finance Report',
        navList: [
            {
                name: "Business Overview",
                children:[
                    { routeTo: ['balance-sheet'], icon:"", code: "FIN_BS", name: "Balance Sheet" },
                    { routeTo: ['profit-loss'], icon:"", code: "FIN_PRL", name: "Profit Loss" }
                ]
            }
        ]
    };

    ngOnInit(){}

    updateLedgerView($event){
        if($event.currentTarget.checked){
            this.router.navigate(['trial-balance', 'by-ledger'], {relativeTo: this.activatedRoute});
        } else {
            this.router.navigate(['trial-balance'], {relativeTo: this.activatedRoute});
        }
    }
}
