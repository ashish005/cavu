import {Component, Injector, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseAPIResolver} from "../services/api.resolver";
import {LookupVoucherType} from "../domains/expense.lookup";

@Component({
  standalone: false,
  templateUrl: './layout.html'
})
export class ExpenseLayout {
  public actionTemplate: TemplateRef<any>;
  public pageTitleTemplate: TemplateRef<any>;
  voucherType: LookupVoucherType;
  asideData: any;

  constructor(public apiResolver: ExpenseAPIResolver,
              public activatedRoute: ActivatedRoute){
     const { vMasterType } = this.activatedRoute.snapshot.data;
     this.voucherType = this.apiResolver.masterType.voucherType;//.find(r => r.voucherMasterType == vMasterType);
     const mainTranslatePath = ''; //this.activatedRoute.snapshot.data.translatePath;
     const translatePath = mainTranslatePath + `.sub_module`;

      this.asideData = {
          title: `${translatePath}.nav.main`,
          navList: [
              {
                  key: `${mainTranslatePath}.nav.main`,
                  children:[
                      { id:1, icon:"fa fa-dashboard", routeTo: 'dashboard', key: `${translatePath}.dashboard.name`, sortOrder: 1 },
                      { id:9, icon:"fa fa-tag", routeTo: 'manage', key: `${translatePath}.manage.name`, sortOrder: 2 },
                      //{ id:10, icon:"fa fa-users", routeTo: 'ledger', name: "Ledger", sortOrder: 1 },
                      { id:10, icon:"fa fa-users", routeTo: 'group', key: `${translatePath}.acc_group.name`, sortOrder: 3 },
                      //{ id:11, icon:"fa fa-users", routeTo: 'templates', name: "Templates", sortOrder: 1 }
                  ]
              },
              {
                  key: `${mainTranslatePath}.nav.all_ledger`,
                  children:[
                      { routeTo: ['ledger', 'all'], icon:"", code:"FIN_DAY", key: `${translatePath}.ledger.name` }
                  ]
              }
          ]
      };
  }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    createNew(){
        /*const inputData: any = {
            data: {
                id: null,
                voucherMasterType: 'PURCHASE'
            }
        };
        this.voucherFactory.showVoucherPopup(inputData, {text: `Expense Invoice`, desc: '' }, ()=>{});*/
    }
  editAccountGroupAction(e){}
}
