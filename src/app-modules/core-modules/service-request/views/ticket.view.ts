import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SupportTicket, SupportTicketQueryOptions} from "../domains/support.domain";
import {SupportTicketService} from "../services/support-ticket.service";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender} from "@app-global";
import {TicketFormComponent} from "../components/ticket-form.component";

@Component({
  standalone: false,
  templateUrl: './templates/ticket.html',
  styles: [`:host{ display: contents; }`]
})
export class TicketView extends ViewExtender<SupportTicket>{
  override coreState: SupportTicketQueryOptions = new SupportTicketQueryOptions();
  public submitted: boolean = false;
  @ViewChild('routerActionTemplate', { static: true }) public routerActionTemplate: TemplateRef<any>;
  constructor(private router: Router,
              public override service: SupportTicketService,
              public override activatedRoute: ActivatedRoute,
              private popupService: SharedService) {
    super(activatedRoute, service);
  }

  ngOnInit(){
    super.populateGrid();
  }

    showDetails(row: SupportTicket){
        this.router.navigate([row.id], {relativeTo: this.activatedRoute});
    }

  createTicket(){
    const popup = {
      header: { text: `Ticket`, desc: `${ACTION_ENUM.ADD} Ticket` },
      aside: ASIDE_CLASS.CENTER,
      size: ASIDE_SIZE.LARGE
    };
    const inputData: any = {
      submitted: false,
      actionType: ACTION_ENUM.SHOW
    };

    let modal$ = this.popupService.showCustomPopup(TicketFormComponent, popup, inputData);
    modal$.then((resp)=>{
      super.populateGrid();
      this.popupService.destroy();
    }, (err)=>{
      this.popupService.destroy();
    });
  }
}
