import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {
    ClientLookup,
    ClientLookupSerializer
} from "../domains/client.lookup";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import {ClientCEComponent} from "../components/client-ce.component";

@Injectable()
export class ClientAPIResolver extends OrgResourceService<ClientLookup> implements Resolve<any> {
    masterType: ClientLookup;
    public items : Array<any> = [
        { id:1, icon:"fa fa-dashboard", route: 'dashboard', name: "dashboard", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'projects/view', name: "projects", sortOrder: 1 },
        { id:10, icon:"fa fa-folder-open", route: 'associates', name: "associates", sortOrder: 1 },

        { id:3, icon:"fa fa-pie-chart", route: 'invoice', name: "invoices", sortOrder: 1 },
        { id:7, icon:"fa fa-shield", route: 'quotation', name: "quotations", sortOrder: 1 }
    ];

    constructor(public override injector: Injector, public sharedService: SharedService) {
        super(injector, 'clientLookup', new ClientLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        //const endpoint = `account/lookup/${route.params.accountId}/${this.coreService.apiVersion}`;
        const setup = this.read(`${this.apiVersion}`);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    showClientCEPopup(inputData: any, header, cb){
        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const success = ()=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ClientCEComponent, popup, inputData);
        modal$.then(success, failure);
    }
}

