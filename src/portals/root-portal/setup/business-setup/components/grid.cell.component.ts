import {Component} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, DynamicComponent} from "@app-global";
import {OrgModulePermissionComponent} from "./module-permission.component";

@Component({
    standalone: false,
    template: `{{ context.name }} 
    <div class="clear">
        {{ context.license.softwareCode }} <b>{{ context.license.licenseType }} </b>
        <button class="permission-btn" (click)="showPermissionModulesPopup(context, context.license)">
            <i class="fa fa-shield-alt"></i>
            <span>Permission</span>
        </button>
    </div>
    `
})
export class BusinessCell extends DynamicComponent {
    constructor(private sharedService: SharedService) {
        super();
    }
    showPermissionModulesPopup(data: any, license: any) {
        const popup = {
            header: {text: `Module Permission ${data.name}`, desc: `Set Module Permissions for ${data.name}`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        const inputData: any = {
            id: data.id,
            data: data,
            license: license
        };
        let modal$ = this.sharedService.showCustomPopup(OrgModulePermissionComponent, popup, inputData);
        modal$.then((resp) => {
            this.sharedService.destroy();
        }, (err) => {
            this.sharedService.destroy();
        });
    }
}

@Component({
  standalone: false,
    template: ` {{context.orgBusinessType}} {{context.countryName}} {{ context.license?.licenseNo }}
    @if (context.license.showExpiryWarning) {
    <div class="expiry-warning">
    @if (context.license.validityInDays < 0) { <span class="status-badge status-expired">Expired</span> }
    @if (context.license.validityInDays >= 0) { <span class="status-badge status-warning">Expiring in {{ context.license.validityInDays }} Days</span> }
    </div>
    }`,
})
export class BusinessPermissionInfo extends DynamicComponent {
    constructor(private sharedService: SharedService) {
        super();
    }
}

@Component({
  standalone: false,
    template: `{{ context.contactPersonName }}
    <div class="contact-item">
        <i class="fa fa-envelope"></i>
        <span>{{ context.contactPersonEmail }}</span>
    </div>`
})
export class BusinessContactGridCell extends DynamicComponent {
    constructor() {
        super();
    }
}
