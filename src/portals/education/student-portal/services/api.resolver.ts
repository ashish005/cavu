import {Injectable, OnDestroy} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";

@Injectable()
export class StudentPortalAPIResolver implements Resolve<any> {
    setupInProgress: boolean = false;
    constructor() { }

    resolve(route: ActivatedRouteSnapshot) {
        return new Promise<any>((resolve, reject)=>{
            const success = (response)=> {
                this.setupInProgress = false;
                return resolve(true);
            };

            const error = (err)=> {
                this.setupInProgress = false;
                return reject(err);
            };

            this.setupInProgress = true;
            success(null);
            /*const setup = forkJoin(
              this.lookupService.getPermissions()
            );*/
            //this.lookupService.getSetupInfo(this.coreService.apiVersion).then(success, error);
        });
    }

    /*populateOrg(data: { parentId: any, childId: any}){
      this.masterType.activeOrgBranch = session;

      const data = this.coreService.globalFilter();
      data.orgSession = session?.name;
      data.orgSessionId = session?.id;
      this.coreService.saveGlobalFilter(data); // Used to set session in request header
    }*/
}