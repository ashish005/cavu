import {Routes} from "@angular/router";
import { ConversationLayout } from "./layout/layout";
import {ManageConversationView} from "./views/manage-conversation.view";
import {ConversationRowDetailsView} from "./views/conversation-row-details.view";

const managePageData = {
  conversation: { title: 'modules.conversation.title', desc:'modules.conversation.desc'},
  inbox: { key:'inbox', title: 'modules.conversation.inbox.title', desc:'modules.conversation.inbox.desc'},
  sent: { key:'sent', title: 'modules.conversation.sent.title', desc:'modules.conversation.sent.desc'},
  outbox: { key:'outbox', title: 'modules.conversation.outbox.title', desc:'modules.conversation.outbox.desc'},
  draft: { key:'draft', title: 'modules.conversation.draft.title', desc:'modules.conversation.draft.desc'},
  trash: { key:'trash', title: 'modules.conversation.trash.title', desc:'modules.conversation.trash.desc'},

  notification: { title: 'modules.notification.title', desc:'modules.notification.desc'}
};

export const CommunicationRoutes: Routes = [
  {
    path: '', data: managePageData.conversation, component: ConversationLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'inbox' },
      { path: 'inbox', component: ManageConversationView, data: managePageData.inbox },
      { path: 'sent', component: ManageConversationView, data: managePageData.sent },
      { path: 'outbox', component: ManageConversationView, data: managePageData.outbox },
      { path: 'draft', component: ManageConversationView, data: managePageData.draft },
      { path: ':key/:id/details', component: ConversationRowDetailsView }
    ]
  }
];

export const COMMUNICATION_VIEWS = [ConversationLayout, ManageConversationView, ConversationRowDetailsView];
