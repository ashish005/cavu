import {RouterModule, ROUTES} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AppSetupService, OrgLookupService, GlobalModule} from "@app-global";

enum ORG_SECTOR {
  SETUP_ORG = "setup_organizations",
  EDUCATION = "education",
  REAL_ESTATE = "real_estate",
  HEALTH_CARE = "health_care",
  HOSPITALLITY = "hospitality",

  TRANSPORTATION = "transportation"
};
enum ORG_USER_TYPE {
  ROOT = "root",
  EMPLOYEE = "employee",
  VENDOR = "vendor",

  CLIENT = "customer",
  STUDENT_PARENT = "parent",
  DRIVER = "driver",
};
export const setupRoutesFactory = (setupService: AppSetupService) => {
  const { license, sectorMasterType }= setupService.appSetup;
  //const userMasterType = coreService.currentUser?.userMasterType;
    const userMasterType = ORG_USER_TYPE.EMPLOYEE;
  // const { license }= this.orgSetup;
  // if(!license){
  //   this.router.navigate(['subscription', 'payment'], { relativeTo: this.activatedRoute.parent });
  // }

  if(ORG_SECTOR.SETUP_ORG === sectorMasterType){
    return [
      {
        path: '',
        loadChildren: () => import('portals/root-portal/root-portal.module').then(m => m.RootPortalModule)
      }
    ];
  }

    return [
        {
            path: '', resolve: {items: OrgLookupService}, //component: CoreLayout, //canLoad: [ModuleGuard],
            children: [
                {
                    path: '', //canLoad: [OrgSetupModuleGuard],
                    loadChildren: () => {
                      switch (sectorMasterType) {
                        case ORG_SECTOR.EDUCATION:
                          switch (userMasterType) {
                            case ORG_USER_TYPE.EMPLOYEE: return import('portals/education/employee-portal/index').then(m => m.EduEmployeePortal);
                          }
                          break;
                        case ORG_SECTOR.REAL_ESTATE:
                          if (userMasterType === ORG_USER_TYPE.EMPLOYEE) {
                            return import('portals/real-estate/employee-portal/index').then(m => m.REEmployeePortal);
                          } else if (userMasterType === ORG_USER_TYPE.VENDOR) {
                            return import('portals/real-estate/vendor-portal/index').then(m => m.VendorPortal);
                          } else if (userMasterType === ORG_USER_TYPE.CLIENT) {
                            return import('portals/real-estate/client-portal/index').then(m => m.ClientPortal);
                          }
                          break;
                        case ORG_SECTOR.HEALTH_CARE:
                          switch (userMasterType) {
                            case ORG_USER_TYPE.EMPLOYEE: return import('portals/health-care/employee-portal/index').then(m => m.HealthCareEmployeePortal);
                          }
                          break;
                        case ORG_SECTOR.HOSPITALLITY:
                          switch (userMasterType) {
                            case ORG_USER_TYPE.EMPLOYEE: return import('portals/hospitality/employee-portal/index').then(m => m.HospitalityEmployeePortal);
                          }
                          break;
                        case ORG_SECTOR.TRANSPORTATION:
                          if (userMasterType === ORG_USER_TYPE.EMPLOYEE) {
                            return import('portals/transportation/employee-portal/index').then(m => m.TransportationEmployeePortal);
                          } else if (userMasterType === ORG_USER_TYPE.DRIVER) {
                            return import('portals/transportation/driver-portal/index').then(m => m.TransportationDriverPortal);
                          }
                          break;
                      }
                      return [];
                    }
                }
                /*{
                    path: 'setup',
                    component: SetupLayout,
                    canActivate:[PortalAuthGuard], canLoad: [ModuleGuard],
                    children: [
                        {
                            path: 'org-log',
                            loadChildren: () => import('app-common/org-log/index').then(m => m.OrgLogModule),
                            data: {title: 'Log', header: 'Log'}
                        },
                        {
                            path: 'process', canLoad: [PortalAuthGuard],
                            loadChildren: () => import('app-modules/core-modules/org-process/index').then(m => m.ProcessModule),
                            data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'}
                        },
                        {
                            path: 'notification', canLoad: [PortalAuthGuard],
                            loadChildren: () => import('app-common/notification/index').then(m => m.NotificationModule),
                            data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
                        },
                        {
                            path: 'compliance', canLoad: [PortalAuthGuard],
                            loadChildren: () => import('app-common/compliance/index').then(m => m.ComplianceModule),
                            data: {title: 'Compliance', header: 'Compliance'}
                        },
                        {
                            path: 'tax-management', canLoad: [PortalAuthGuard],
                            loadChildren: () => import('app-common/tax-management/index').then(m => m.TaxManagementModule),
                            data: {code: "ACCESS_TAX_MGT", title: 'Tax', header: 'Manage Tax'}
                        },
                        {
                            path: 'setup-trxn',
                            loadChildren: () => import('app-common/setup-transaction/index').then(m => m.SetupTransactionModule),
                            data: {title: 'Bank', header: 'Bank', name: "Banking", key: 'layout.banking'}//code: "ACCESS_VT_MGT",
                        },
                        { path: 'module-access-setup',
                            loadChildren: () => import('app-common/access-setup/contact-access/index').then(m => m.ContactAccessSetupModule),
                            data: { userType: ORG_USER_TYPE.EMPLOYEE }
                        },
                        {
                            path: 'role-permission-setup',
                            loadChildren: () => import('app-common/access-setup/module-permission/index').then(m => m.ManageUserModule),
                            data: { key:'list', icon:"fa fa-money", name: "Money", title: 'Team', header:'Team' }//code: "ACCESS_USR_LOGIN"
                        },
                        {
                            path: 'org-team',
                            loadChildren: () => import('app-common/team-setup/index').then(m => m.TeamSetupModule),
                            data: { icon:"fa fa-money", name: "Money", key: 'layout.team', title: 'Team', header:'Team' }//code: "TEAM",
                        },
                        {
                            path: 'integration',
                            loadChildren: () => import('app-common/integration/index').then(m => m.IntegrationModule),
                            data: {title: 'Integration', header: 'Integration'}//code: '',
                        },
                        {
                            path: 'quiz',
                            loadChildren: () => import('app-common/quiz/index').then(r => r.QuizModule),
                            data: {title: 'Quiz', header: 'Quiz'}
                        },
                        {
                            path: 'subscription',
                            loadChildren: () => import('app-common/org-subscription/index').then(m => m.OrgSubscriptionModule),
                            data: { key:'Subscription', icon:"fa fa-money", name: "Subscription", title: 'Subscription', header:'Subscription' }
                        },
                        {
                            path: 'transaction-setup',
                            loadChildren: () => import('app-common/setup-transaction/index').then(m => m.SetupTransactionModule),
                            data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
                        },
                        {
                            path: 'bank-trxn', canLoad:[ModuleGuard],
                            loadChildren: () => import('app-common/setup-transaction/transaction').then(m => m.BankTransactionModule),
                            data: {title: 'Trxn', header:'Bank Trxn', name: "Bank Trxn", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
                        },
                        {
                            path: 'org-setup',
                            loadChildren: () => import('app-common/org-setup/index').then(m => m.OrgSetupModule),
                            data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
                        },
                        {
                            path: 'payroll', canLoad:[ModuleGuard],
                            loadChildren: () => import('app-common/salary').then(m => m.SalaryModule),
                            data: {title: 'Trxn', header:'Payroll', name: "Payroll", key: 'Payroll' }//code: "ACCESS_VT_MGT",
                        }
                    ]
                }*/
            ]
        }
    ];
};

@NgModule({
  //declarations: [ SetupLayout, ProcessLayout, ComplianceLayout, LogLayout ],
  imports: [RouterModule, CommonModule, GlobalModule],
    providers: [
        { provide: ROUTES, useFactory: setupRoutesFactory, multi: true, deps: [ AppSetupService ] }
    ]
})
export class PortalModule { }
