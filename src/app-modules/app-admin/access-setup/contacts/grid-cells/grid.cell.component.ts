import {Component, Input} from "@angular/core";
import {ContactService} from "../services/contact.service";
import {DynamicComponent} from "@app-global";
import {ContactAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    template: `<a [class]="(context.orgUserId)? 'text-success': 'text-warning'" (click)="grantAccess()">
        <span *ngIf="grantAccessInProgress"><i class="pr-2 fa fa-refresh"></i> In Progress</span>
        <span *ngIf="!grantAccessInProgress">{{context.orgUserId ? 'Allowed': 'Grant Access'}} </span>
    </a>`
})
export class LoginGrantAccessCell extends DynamicComponent{
    grantAccessInProgress: boolean = false;
    constructor(private apiResolver: ContactAPIResolver, public service: ContactService){ super(); }

    grantAccess(){
        const { id, name, orgUserId } = this.context;

        const inputData: any = {
            id: id,
            orgUserId: orgUserId,
            data: this.context
        };

      this.grantAccessInProgress = true;

      const finalSuccess = (r)=> {
          this.grantAccessInProgress = false;
          this.context.orgUserId = r.data.orgUserId;
      };
      const error = ()=> { this.grantAccessInProgress = false; };
      this.apiResolver.showLoginGrantPopup(inputData, { text: `${name}`, desc: `${name}` }, finalSuccess, error);
    }
}
