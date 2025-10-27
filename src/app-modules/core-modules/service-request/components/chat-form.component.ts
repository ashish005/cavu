import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Conversation} from "../domains/conversation.serializer";
import {TicketConversationService} from "../services/conversation-ticket.service";

@Component({
  standalone: false,
  selector: 'chat-form',
  templateUrl: './templates/chat-form.html'
})
export class ChatFormComponent {
  customForm: FormGroup;
  @Input() id;
  @Input() ticket;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  constructor(public fb: FormBuilder, public service: TicketConversationService) {
    this.customForm = this.fb.group({
      content: [null, Validators.required]
    });
  }

    add(form: any) {
      const { id, userId, userTypeId, mediaTypeId, header } = this.ticket;
      /*const user = this.service.getCurrentUser();
      this.service.create(new Conversation({
          parentId: this.id,
          header: header,
          content: form.value.content,
          userId: userId,
          userTypeId: userTypeId,
          mediaTypeId: mediaTypeId,
          supportTicketId: id,
          handledByUserId: user?.id
      })).toPromise().then(r => this.onOk.emit({ refresh: true }));*/
    }
}
