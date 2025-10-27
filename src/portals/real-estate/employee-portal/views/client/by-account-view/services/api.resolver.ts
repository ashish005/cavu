import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {
    ClientLookup,
    ClientLookupSerializer
} from "../domains/client.lookup";
import {Client, ClientSerializer} from "../domains/client.serializer";
import { OrgResourceService, ASIDE_CLASS, ASIDE_SIZE, SharedService } from "@app-global";
import {ClientMemberCEComponent} from "../components/client-member-ce.component";

@Injectable()
export class ClientAPIResolver extends OrgResourceService<ClientLookup> implements Resolve<any> {
    masterType: ClientLookup;
    public items : Array<any> = [
        { id:1, icon:"fa fa-dashboard", route: 'dashboard', name: "sideOptions.dashboard", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'projects/view', name: "sideOptions.projects", sortOrder: 1 },
        { id:10, icon:"fa fa-folder-open", route: 'associates', name: "sideOptions.associates", sortOrder: 1 },

        { id:3, icon:"fa fa-pie-chart", route: 'invoice', name: "sideOptions.invoices", sortOrder: 1 },
        { id:7, icon:"fa fa-shield", route: 'quotation', name: "sideOptions.quotations", sortOrder: 1 }
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

    showContactCEPopup(inputData: any, header, cb){
        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = (e)=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ClientMemberCEComponent, popup, inputData);
        modal$.then(success, failure);
    }
}

@Injectable()
export class ClientByIdAPIResolver extends OrgResourceService<Client> implements Resolve<any> {
    client: Client;
    constructor(public override injector: Injector) { super(injector, 'customer', new ClientSerializer()); }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const {accountId} = route.params;
        const success = (results) => { this.client = results.data; };
        const failure = (err: any) => {};
        const endpoint = `account/lookup/${accountId}/${this.apiVersion}`;
        const setup = super.read(endpoint);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}

