import {
  ActivatedRouteSnapshot,
  CanLoad,
  Route,
  Router,
  RouterModule,
  RouterStateSnapshot,
  ROUTES,
  UrlSegment,
  UrlTree
} from "@angular/router";
import {Injectable, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AppSetupService, OrgLookupService, GlobalModule, PreSetupLayout} from "@app-global";

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

  const hasValidSetup = setupService.appSetup.hasValidOrgSetup();
  debugger
  if (!hasValidSetup) {
    return [
      {
        path: '', component: PreSetupLayout,
        loadChildren: () => import('app-modules/pre-org-setup').then(m => m.OrgCoreSetupModule)
      }
    ];
  }

    return [
        {
            path: '', resolve: {items: OrgLookupService}, //component: CoreLayout,
            children: [
                {
                    path: '',
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
            ]
        }
    ];
};

@NgModule({
  imports: [RouterModule, CommonModule, GlobalModule],
    providers: [
      { provide: ROUTES, useFactory: setupRoutesFactory, multi: true, deps: [ AppSetupService ] }
    ]
})
export class PortalModule { }
