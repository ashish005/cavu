import {
  RouterModule,
  ROUTES
} from "@angular/router";
import {Injectable, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AppSetupService, OrgLookupService, GlobalModule, PreSetupLayout, CoreLayout, ORG_SECTOR} from "@app-global";

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
    const userMasterType = ORG_USER_TYPE.EMPLOYEE;

  if(ORG_SECTOR.SETUP_ORG === sectorMasterType){
    return [
      {
        path: '',
        loadChildren: () => import('portals/root-portal/root-portal.module').then(m => m.RootPortalModule)
      }
    ];
  }

  const hasValidSetup = setupService.appSetup.hasValidOrgSetup();

  if (!hasValidSetup) {
    return [
      {
        path: '', component: PreSetupLayout,
        loadChildren: () => import('app-modules/pre-org-setup').then(m => m.OrgCoreSetupModule)
      }
    ];
  }

  if(!license || license?.validityInDays < 0){
    return [
      {
        path: '', component: PreSetupLayout,
        loadChildren: () => import('app-modules/admin-modules/org-subscription/index').then(m => m.OrgSubscriptionModule)
      }
    ];
  }

    return [
        {
            path: '', resolve: {items: OrgLookupService}, component: CoreLayout,
            children: [
                {
                    path: '',
                    loadChildren: () => {
                      switch (sectorMasterType) {
                        case ORG_SECTOR.EDUCATION:
                          if (userMasterType === ORG_USER_TYPE.EMPLOYEE) {
                            return import('portals/education/employee-portal/index').then(m => m.EduEmployeePortal);
                          } else if (userMasterType === ORG_USER_TYPE.STUDENT_PARENT) {
                            return import('portals/education/parent-portal/index').then(m => m.EduParentPortal);
                          } else if (userMasterType === ORG_USER_TYPE.CLIENT) {
                            return import('portals/education/student-portal/index').then(m => m.EduStudentPortal);
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
