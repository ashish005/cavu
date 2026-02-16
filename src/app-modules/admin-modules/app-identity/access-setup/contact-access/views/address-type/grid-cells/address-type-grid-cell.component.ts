import {Component, Injectable} from "@angular/core";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
    template: `<ng-container *ngFor="let perm of context.rulePermissions; let i = index">
        <div class="d-inline-block px-1 mx-1 b-a text-sm">
            <i class="fa fa-user text-sm mr-1" [class.text-success]="perm.isActive"></i>
            <small class="title _500 pr-2" [class.text-success]="perm.isVerificationRequired">
                {{ perm.userTypeName }}
            </small>
            <span class="px-1">
      <i class="fa text-sm" [ngClass]="perm.isMandatory ? 'fa-eye text-success' : 'fa-eye-slash text-warning'">
      </i>
    </span>
        </div>
    </ng-container>
    `
})
export class AddressTypeGridCellComponent extends DynamicComponent {
    constructor() {
        super();
    }
}