import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FeedbackSupportService} from "../services/feedback-support.service";

@Component({
  standalone: false,
  templateUrl: `./templates/notification-bell-reminder.html`,
  styles: [`:host{ display: contents; }`],
    providers: [FeedbackSupportService]
})
export class NotificationBellReminderComponent implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  navList: Array<any> = [
    //{ id: 1, name: 'Meetings' },
    { id: 'status', name: 'Notification' },
    { id: 'reminder', name: 'Reminder' },
    { id: 'update', name: 'Updates' }
  ];
  activeNavId: string = this.navList[0].id;
  data: Array<any>;
  isLoading: boolean = false;
  constructor(public service: FeedbackSupportService){}

  ngOnInit(){
    this.callService();
  }

  updateNav(nav: any){
    this.activeNavId = nav.id;
    this.callService();
  }

  callService(){
    this.isLoading = true;
    this.service.getNotification(this.activeNavId).then((r: any)=> {
      this.data = r.entities;
      this.isLoading = false;
    }, err=> {
      this.isLoading = false;
    });
  }
}
