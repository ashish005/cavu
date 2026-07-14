import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Contact, ContactQueryOptions} from "../domains/contact.serializer";
import {ContactService} from "../services/contact.service";
import {LoginGrantAccessCell} from "../grid-cells";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {UserManagementAPIResolver} from "../services/api.resolver";
@Component({
  standalone: false,
  templateUrl: './templates/contact.html',
  styles: [`:host { display: contents;}`]
})
export class ContactView extends ViewExtender<Contact> implements OnInit, OnDestroy
{
  override coreState: ContactQueryOptions = new ContactQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: ContactService,
              public lookupResolver: UserManagementAPIResolver) {
    super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          { headerName: 'Name', field: 'name'  },
          { headerName: 'Email', field: 'email' },
          { headerName: 'Phone', field: 'phone' },
          { headerName: 'User Type', field: 'userTypeName' },
          { headerName: 'roles', cellFn: (row) => `${row.activeRoles()}` },
          {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent},
          { headerName: 'Login Grant', field: 'orgUserId', cellTemplate: LoginGrantAccessCell }
          //{ headerName: 'Login', field: 'orgUserId', cellFn: (row) => `${row.orgUserId ? 'App Accesss: Allowed': 'App Accesss: Grant'}` }
      ];
  }

  ngOnInit(){
      super.populateGrid();
  }

  override ngOnDestroy(){
    super.ngOnDestroy();
  }
  actionCb(e){}
}
