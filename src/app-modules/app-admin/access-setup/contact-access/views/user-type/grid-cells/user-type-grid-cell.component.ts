import {Component, Injectable} from "@angular/core";
import {DynamicComponent} from "@app-global";
@Component({
  standalone: false,
    template: `<ng-container *ngFor="let perm of context.userRoles; let i = index">
        <div class="d-inline-block px-1 mx-1 b-a text-sm">
            <i class="fa fa-user text-sm mr-1" [class.text-success]="perm.isActive"></i>
            <small class="title _500 pr-2">{{ perm.name }}</small>
        </div>
    </ng-container>`
})
export class UserTypeGridCellComponent extends DynamicComponent {
    constructor() {
        super();
    }
}