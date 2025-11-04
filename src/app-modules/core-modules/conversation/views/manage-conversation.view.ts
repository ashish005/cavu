import {AfterViewInit, Component, Directive, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FullDateFormatCell, ViewExtender} from "@app-global";
import {Conversation, ConversationQueryOptions} from "../domains/conversation.serializer";
import {ConversationService} from "../services/conversation.service";

@Component({
  standalone: false,
  templateUrl: './templates/manage-conversation.html'
})
export class ManageConversationView extends ViewExtender<Conversation> implements OnInit {
  view: string;
  override coreState: ConversationQueryOptions = new ConversationQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: ConversationService){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'Created Date', field: 'createdDate', cellTemplate: FullDateFormatCell},
            {headerName: 'modified Date', field: 'modifiedDate', cellTemplate: FullDateFormatCell}
        ];
    }

    //public get getOrgUserId (){ return this.coreService.currentUser.id; }

    ngOnInit() {
      const { key } = this.activatedRoute.snapshot.data;
      this.view = key;
        (<ConversationQueryOptions>this.coreState).conversationType = this.view;
        //(<ConversationQueryOptions>this.coreState).orgUserId = this.getOrgUserId;
        super.populateGrid();
    }

    navigateToDetails(row){
        this.router.navigate([this.view, row.id, 'details'], {relativeTo: this.activatedRoute.parent});
    }
}
