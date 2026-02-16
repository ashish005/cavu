import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class ReportLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    page: any;
    public layout: any;
    public componentRef: any;
    public searchFilter: any;

    onActivate(componentRef){
        this.page = componentRef.activatedRoute.snapshot.data;
        this.componentRef = componentRef;
        if(this.searchFilter){
            if(componentRef.coreState.accountId){
                this.searchFilter.accountId = componentRef.coreState.accountId;
            }

            this.componentRef.searchActionCb(this.searchFilter);
        }
    }

    searchActionCb(row: any) {
        this.searchFilter = row;
        this.componentRef?.searchActionCb(row);
    }
    get showTrialBalanceOption(){ return this.page?.code == 'FIN_TB';};
    constructor(private router: Router,
                public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){
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
