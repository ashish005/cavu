import {Component, OnDestroy} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, DynamicComponent} from "@app-global";
import {OrgModulePermissionComponent} from "./module-permission.component";
import {OrgBranchesComponent} from "./org-branches.component";
import {OrgBranchService} from "../services/business.service";
import {Observable, Subscription} from "rxjs";

@Component({
    standalone: false,
    template: `<button class="btn btn-xs" (click)="seed()" [disabled]="submitted">
        <i *ngIf="submitted" class='fa fa-circle-o-notch fa-spin'></i>
        <span>Seed</span>
    </button>
    {{ context.name }}
    `
})
export class OrgBranchNameCell extends DynamicComponent implements OnDestroy{
    submitted: boolean = false;
    subs: Subscription;
    constructor(private branchService: OrgBranchService) { super(); }
    seed() {
        const req = {
            orgId: this.context.orgUnitId,
            orgBranchId: this.context.id
        };
        this.submitted = true;
        this.subs = this.branchService.seed(req).subscribe((r: any)=> {
            this.submitted = false;
        }, ()=>{
            this.submitted = false;
        });
    }

    ngOnDestroy() {
        this.subs?.unsubscribe();
    }
}

@Component({
    standalone: false,
    template: ` <button class="btn btn-xs" (click)="showBranchesPopup(context)">
        <i class="fa fa-shield-alt"></i>
        <span>Branches</span>
    </button>
    {{ context.name }}
    `
})
export class BusinessNameCell extends DynamicComponent {
    constructor(private sharedService: SharedService) { super(); }
    showBranchesPopup(data: any) {
        const popup = {
            header: {text: `Branches ${data.name}`, desc: `Branches for ${data.name}`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        const inputData: any = {
            id: data.orgUnitId
        };
        let modal$ = this.sharedService.showCustomPopup(OrgBranchesComponent, popup, inputData);
        modal$.then((resp) => {
            this.sharedService.destroy();
        }, (err) => {
            this.sharedService.destroy();
        });
    }
}

@Component({
    standalone: false,
    template: ` <button class="btn btn-xs" (click)="showPermissionModulesPopup(context, context.license)">
        <i class="fa fa-shield-alt"></i>
        <span>Permission</span>
    </button>
    {{ context.businessTypeName }}
    `
})
export class BusinessCell extends DynamicComponent {
    constructor(private sharedService: SharedService) { super(); }
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
