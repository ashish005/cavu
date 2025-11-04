import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { GridUISwitchCellComponent, ViewExtender } from "@app-global";
import {User, UserQueryOptions} from "../domains/user.model";
import {UserManagementService} from "../services/user-management.service";
import { UserNameCell, UserContactCell, UserLoginInfoCell} from "../grid-cells";

@Component({
    standalone: false,
    templateUrl: './templates/users-management.html'
})
export class UsersManagementView extends ViewExtender<User> implements OnInit {
  @ViewChild('indexTemplate', { static: true }) indexTemplate: TemplateRef<any>;
  @ViewChild('userNameTemplate', { static: true }) userNameTemplate: TemplateRef<any>;
  @ViewChild('rolesTemplate', { static: true }) rolesTemplate: TemplateRef<any>;

  override coreState: UserQueryOptions = new UserQueryOptions();
  constructor(public override service: UserManagementService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.header.edit = false;
    this.gridOptions.columnDefs = [
        {headerName: 'Full Name', field: 'name', cellTemplate: UserNameCell },
        {headerName: 'Contact', field: 'Contact', cellTemplate: UserContactCell },
        {headerName: 'User Name', field: 'userName', cellTemplate: UserLoginInfoCell},
        {headerName: 'Roles', field: 'displayRoles'},
        {headerName: 'web Access', field: 'webAccessAllowed', cellTemplate: GridUISwitchCellComponent },
        {headerName: 'Email Confirmed', field: 'emailConfirmed', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Lockout Enabled', field: 'lockoutEnabled', cellTemplate: GridUISwitchCellComponent},
    ];
  }

  ngOnInit() {
    super.populateGrid();
  }

    actionCb(e){}
}
