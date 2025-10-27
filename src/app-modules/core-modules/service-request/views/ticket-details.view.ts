import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SupportTicketService} from "../services/support-ticket.service";
import {ActivatedRoute} from "@angular/router";
import {SupportTicket} from "../domains/support.domain";
import {TicketConversationService} from "../services/conversation-ticket.service";
import {ViewExtender} from "@app-global";
import {Conversation, ConversationQueryOptions} from "../domains/conversation.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/ticket-details.html',
  styles: [`:host{ display: contents; }`]
})
export class TicketDetailsView extends ViewExtender<Conversation> implements OnInit {
  data: SupportTicket;
  override coreState: ConversationQueryOptions = new ConversationQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public ticketService: SupportTicketService,
              public override service: TicketConversationService) {
      super(activatedRoute, service);
  }
  ngOnInit() {
    const { id } = this.activatedRoute.snapshot.params;
    this.ticketService.read(id).subscribe(r => { this.data = r.data; });

    this.coreState.ticketId = id;
    super.populateGrid();
  }

  fetchRecords(e){ super.populateGrid(); }
}
