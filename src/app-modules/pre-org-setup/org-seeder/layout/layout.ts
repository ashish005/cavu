import {Component} from "@angular/core";
import {AppSetupService} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/org.html'
})
export class OrgLayout {
    submitted: boolean;
    constructor(public setupService: AppSetupService){
    }

    get orgSetupSuccessfully(){ return this.setupService.appSetup.branches;}

    onFinalizeSetup() {
        const { id, masterBranch } = this.setupService.appSetup;

        /*const setupArr = [];
        setupArr.push(this.setupService.syncUserRolesEndpoint(id, masterBranch.id));
        forkJoin(setupArr).subscribe((resp: any)=>{
            setTimeout(() => { location.href = location.href; }, 100);
        }, (err: any)=>{});*/
    }
}
