import { NgModule } from '@angular/core';

import {CommonModule} from "@angular/common"
import {RouterModule, ROUTES} from "@angular/router";
import {
  AppSetupService
} from "@app-global";

export const companyRoutesFactory = (setupService: AppSetupService) => {
  const { sectorMasterType }= setupService?.appSetup || { sectorMasterType: null };
  /*if(ORG_SECTOR.COMPANY === sectorMasterType){
    return [
      {
        path: '',
        loadChildren: () => import('portals/company/app.router').then(m => m.AppCompanyModule)
      }
    ];
  }*/
  return [
    {
      path: '',
      loadChildren: () => import('portals/company/app.router').then(m => m.OrgCompanyModule)
    }
  ];
};

@NgModule({
  imports: [
    CommonModule, RouterModule
  ],
  providers: [
    { provide: ROUTES, useFactory: companyRoutesFactory, multi: true, deps: [ AppSetupService ] }
  ]
})
export class CompanyModule { }
