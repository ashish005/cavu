import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Contact, ContactQueryOptions} from "../domains/contact.serializer";
import {ClientAPIResolver, ClientContactService} from "../services";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/member-view.html'
})
export class ClientMemberView extends ViewExtender<Contact> implements OnInit {
  accountId: string;
  override coreState: ContactQueryOptions = new ContactQueryOptions();
  constructor(public override service: ClientContactService, public override activatedRoute: ActivatedRoute, public apiResolver: ClientAPIResolver)
  {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'grid.header.name', field: 'name' },
          {headerName: 'grid.header.email', field: 'email' },
          {headerName: 'grid.header.phone', field: 'phone' },
          {headerName: 'grid.header.contact.relation', field: 'relationType' },
          {headerName: 'grid.header.contact.primary', field: 'isPrimary', cellTemplate: GridUISwitchCellComponent }
      ];
  }

  ngOnInit(){
      this.coreState.accountId = this.accountId;
      super.populateGrid();
  }
    addNew(){
        const inputData: any = {
            data: {
                accountId: this.accountId,
            },
            accountId: this.accountId
        };

        this.apiResolver.showContactCEPopup(inputData, { text: `New Contact`, desc: '' }, ()=>{
            this.populateGrid();
        });
    }

    actionCb(row: Contact){
        row.accountId = this.accountId;
        const inputData: any = {
            id: row.id,
            accountId: this.accountId,
            data: row
        };
        this.apiResolver.showContactCEPopup(inputData, { text: `Contact: ${row.name}`, desc: '' }, ()=>{
            this.populateGrid();
        });
    }
}
