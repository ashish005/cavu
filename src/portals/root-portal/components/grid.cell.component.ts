import {Component} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, DynamicComponent} from "@app-global";
import {OrgModulePermissionComponent} from "./module-permission.component";

@Component({
  standalone: false,
    template: `
      @if (context.orgSectorMasterType != 'setup_organizations') {
      <div>{{ context.license?.licenseNo }}
        {{ context.license.softwareCode }}: {{ context.license.licenseType }}
        @if (context.license.showExpiryWarning) {
            <div class="d-inline-block">
              @if (context.license.validityInDays < 0) { <span class="badge mx-2 red">Expired</span> }
              @if (context.license.validityInDays >= 0) { <span class="badge mx-2 warning"> Expiring in {{ context.license.validityInDays }} Days </span> }
            </div>
        }
          <button class="btn btn-xs theme b-theme text-xs border px-1 mx-1" (click)="showPermissionModulesPopup(context, context.license)">Permission</button>
    </div>
      }`
})
export class BusinessPermissionInfo extends DynamicComponent {
    constructor(private sharedService: SharedService) {
        super();
    }
    showPermissionModulesPopup(data, license) {
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
    template: `<div>{{ context.contactPersonName }}
    <div class="item-except text-sm text-muted h-1x">{{ context.contactPersonEmail }} {{ context.contactPersonMobile }}</div>
</div>`
})
export class BusinessContactGridCell extends DynamicComponent {
    constructor() {
        super();
    }
}
