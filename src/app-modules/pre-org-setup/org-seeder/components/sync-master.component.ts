import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OrgSettingService} from "../services/org-setting.service";
import {AppSetupService} from "../../../../app/global/services";
import {AppSetup} from "../../../../app/global/services/models";
@Component({
    standalone: false,
    selector: 'sync-feeder',
    templateUrl: './templates/sync-feeder.html',
    providers: [OrgSettingService]
})
export class SyncMasterComponent {
    submitted: boolean = false;
    masterBranch: any;
    orgSetup: AppSetup;
    constructor(public route: Router,
                public setupService: AppSetupService,
                public service: OrgSettingService) {
        this.orgSetup = this.setupService.appSetup;
        this.masterBranch = this.orgSetup.masterBranch;
    }
    hasValidConfig: boolean = false;
    syncMasterFeeder(branch) {
        branch.syncInitiated = true;
        const error = (resp: any) => { };
        const success = (resp: any) => {
            branch.syncInitiated = false;
        };
        const v = this.service.seederOrgBranchAsync(branch.id);
        v.subscribe(success, error);
    }

    syncRoleFeeder(branch) {
        const error = (resp: any) => { };
        const success = (resp: any) => {};
        this.service.syncUserRolesEndpoint(branch.id).then(success, error);
    }
}