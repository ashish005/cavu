import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";
import {GlobalModule, EMPLOYEE_COMMON_ROUES} from "@app-global";

@Component({
    templateUrl: './templates/layout.html',
  standalone: true, styles: [`::ng-deep ng-component{ display: contents;}`],
  imports: [RouterModule, GlobalModule]
})
export class MainLayout implements OnInit {
  public navList: Array<any> = this.permService.getEmployeeNavList([
      {
          isFLatChildren: true, key: 'mainLayout.heading.main',
          children:[
              { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'dashboard' },
              /*{ routeTo: ['invoices'], icon:"fa fa-dashboard", name: "Invoices" },
              { routeTo: ['payments'], icon:"fa fa-dashboard", name: "Payments" },
              { routeTo: ['expenses'], icon:"fa fa-dashboard", name: "Expenses" },
              { routeTo: ['estimates'], icon:"fa fa-dashboard", name: "Estimates" },
              { routeTo: ['time-tracking'], icon:"fa fa-dashboard", name: "Time Tracking" },*/
              //{ routeTo: ['project'], icon:"fa fa-dashboard", name: "Projects" },
              { routeTo: ['project'], icon:"fa fa-bell", key: 'project' },//code: "PERM_PROJECT"
              { routeTo: ['product'], icon:"fa fa-dashboard", key: 'svc_product' },//code: "PERM_INVENTORY",
              { routeTo: ['client/quotation'], icon:"fa fa-bell", key: 'Quotation' }
          ]
      },
      ...EMPLOYEE_COMMON_ROUES
  ]);

  orgLookup: OrgLookup;
  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public cdref: ChangeDetectorRef,
              public permService: AppPermissionService, public lookupService: OrgLookupService){
      this.orgLookup = this.lookupService.getOrgLookup();
  }

  ngOnInit() {
      /*switch (this.key)
        {
            case this.OPT.SETTING: {
                this.navData = this.permService.getEmployeeNavList([
                    {
                        id:'administration', isFLatChildren: false, key: 'mainLayout.heading.admin',
                        children:[
                            { routeTo: ['integration'], icon:"fa fa-envelope-open", code: "ACCESS_VT_MGT", name: "Integration", key: 'mainLayout.integration' }
                        ]
                    }
                ]);
                break;
            }
            default:
                this.showMyNavOptions = true;
                this.navData = this.permService.getEmployeeNavList([
                    {
                        isFLatChildren: true, key: 'mainLayout.heading.main',
                        children:[
                            { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' },
                            // { routeTo: ['invoices'], icon:"fa fa-dashboard", name: "Invoices" },
                            // { routeTo: ['payments'], icon:"fa fa-dashboard", name: "Payments" },
                            // { routeTo: ['expenses'], icon:"fa fa-dashboard", name: "Expenses" },
                            // { routeTo: ['estimates'], icon:"fa fa-dashboard", name: "Estimates" },
                            // { routeTo: ['time-tracking'], icon:"fa fa-dashboard", name: "Time Tracking" },
                            { routeTo: ['project'], icon:"fa fa-dashboard", name: "Projects" },
                            { routeTo: ['project'], icon:"fa fa-bell", code: "PERM_PROJECT", key: 'mainLayout.project' },
                            { routeTo: ['product'], icon:"fa fa-dashboard", code: "PERM_INVENTORY", key: 'mainLayout.svc_product' },
                            { routeTo: ['expense'], icon:"fa fa-bell", code: "OFC_EXPENSE", key: 'mainLayout.ofc_expense' },
                            { routeTo: ['quotation'], icon:"fa fa-bell", name: "Quotation", key: 'mainLayout.quote' },
                            { routeTo: ['invoice'], icon:"fa fa-bell", name: "Invoice", key: 'mainLayout.invoice' }
                        ]
                    },
                    {
                        isFLatChildren: false, key: 'mainLayout.heading.contact',
                        children:[
                            { routeTo: ['org-emp'], icon:"fa fa-group", code: "EMP", key: 'mainLayout.user.employee' },
                            { routeTo: ['vendor'], icon:"fa fa-bell", code: "PERM_VENDOR", key: 'mainLayout.user.supplier' },//code: "COM"
                            { routeTo: ['client'], icon:"fa fa-bell", code: "PERM_CLIENT", key: 'mainLayout.user.client' },//code: "COM"
                        ]
                    },
                    {
                        isFLatChildren: false, key: 'mainLayout.heading.acc_fin',
                        children:[
                            { routeTo: ['accounting/ledger'], icon:"fa fa-money", code: "FIN_ACG", key: 'mainLayout.acct.ledger' },
                            { routeTo: ['accounting/book'], icon:"fa fa-money", code: "FIN", name: "Accounting", key: 'mainLayout.acct.book' },
                            { routeTo: ['accounting/invoice'], icon:"fa fa-money", code: "FIN", key: 'mainLayout.acct.invoice' },
                            { routeTo: ['accounting/inventory'], icon:"fa fa-money", code: "FIN", key: 'mainLayout.acct.inventory' },
                            { routeTo: ['accounting/report'], icon:"fa fa-money", code: "FIN_REPORT", key: 'mainLayout.acct.report' }, //
                            // { routeTo: ['salary'], icon:"fa fa-credit-card", code: "SAL", name: "Salary", key: 'layout.salary' },
                            // { routeTo: ['salary/payroll'], icon:"fa fa-users", code:'SAL_PAYROLL', name: "Pay Roll", key: 'layout.payroll' }
                        ]
                    }
                ]);
                break;
        }*/
  }

    onActivate(componentRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});
    // logout = () => this.coreService.logoutAndRedirectToLoginScreen();
    // getYear = () => new Date().getUTCFullYear();
    // get userName(): string { return this.coreService.currentUser?.userName; }
    // get fullName(): string { return this.coreService.currentUser ? this.coreService.currentUser.fullName : ''; }

    onNewVoucherClick(voucherType: any) {
        this.router.navigate(['invoice', 'create', voucherType.masterType], {relativeTo: this.activatedRoute});
        // const {name, masterType, id} = voucherType;
        // const inputData = {
        //     data: {
        //         voucherMasterType: masterType,
        //         voucherType: name,
        //         voucherTypeId: id
        //     }
        // };
        // const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        // const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        // this.pluginFactory.showVoucherReportPopup(inputData, {text: `New ${name}`, desc: ''}).then(onSuccess, onFailure);
    }
}
