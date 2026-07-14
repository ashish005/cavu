import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './layout.html', styles: [`:host { display: contents;}`]
})
export class QuotationLayout implements OnInit, OnDestroy {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    hideSidebar: boolean;
    vTypeMapper: any;

    asideData: any;
    constructor(private router: Router, public activatedRoute: ActivatedRoute){
        //this.vTypeMapper = this.coreService.orgLookup.voucherTypeDictionary;
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
