import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {AccountingAPIResolver} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/admin-setup.html'
})
export class AccountingAdminView implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  selectedGroup: any;

  constructor(private apiResolver: AccountingAPIResolver) {}

  ngOnInit() {}

  onGroupSelected(group: any) {
    this.selectedGroup = group;
  }

  addAccount() {
    const inputData = {
      id: null,
      data: null,
      accountGroupId: this.selectedGroup ? this.selectedGroup.id : null
    };
    this.apiResolver.accountPopup(inputData, { text: 'New Account', desc: 'Add Account to ' + (this.selectedGroup ? this.selectedGroup.name : 'Chart of Accounts') }, () => {
      // Refresh logic if needed, though AccountGroupTree might handle it
    });
  }

  addAccountGroup() {
    const inputData = {
      id: null,
      data: null,
      parentId: this.selectedGroup ? this.selectedGroup.id : null
    };
    this.apiResolver.accountGroupPopup(inputData, { text: 'New Account Group', desc: 'Add Sub-group to ' + (this.selectedGroup ? this.selectedGroup.name : 'Chart of Accounts') }, () => {
      // Refresh logic if needed, though AccountGroupTree might handle it
    });
  }
}
