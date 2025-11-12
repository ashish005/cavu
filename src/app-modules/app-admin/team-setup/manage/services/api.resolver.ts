import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, OrgResourceService, SharedService} from "@app-global";
import {TeamSetupLookup, TeamSetupLookupSerializer} from "../domains/lookup.serializer";
import {TeamCeView} from "../components";
import {StaticRecordsComponent} from "../components/static-records.component";

@Injectable()
export class TeamSetupAPIResolver extends OrgResourceService<TeamSetupLookup> implements Resolve<any> {
    masterType: TeamSetupLookup;
    constructor(public override injector: Injector, private sharedService: SharedService) { super(injector, 'teamLookup', new TeamSetupLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => { this.masterType = results['data']; };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    teamCreateEditPopup(inputData, headerOptions, cb){
        const popupOptions = {
            header: headerOptions || { text: `Group`, desc: 'Group' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        inputData = inputData || { id: null, data: null };

        const onSuccess = (resp)=> {this.sharedService.destroy(); cb(); };
        const failure = (resp)=> {this.sharedService.destroy();};
        this.sharedService.showCustomPopup(TeamCeView, popupOptions, inputData).then(onSuccess, failure);
    }

    showStaticRecordPopup(inputData, headerOptions, cb){
        const popupOptions = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        inputData = inputData || { id: null, data: null };
        const onSuccess = (resp)=> {this.sharedService.destroy(); cb(); };
        const failure = (resp)=> {this.sharedService.destroy();};
        this.sharedService.showCustomPopup(StaticRecordsComponent, popupOptions, inputData).then(onSuccess, failure);
    }
}
