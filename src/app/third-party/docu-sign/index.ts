import {Routes} from "@angular/router";
import {DocusignRecipientSignedView} from "./views/docusign-recipient-signed.view";
import {DocusignReviewedSentView} from "./views/docusign-reviewed-sent.view";
import {DocusignSignView} from "./views/docusign-sign.view";

export const DOCU_SIGN_VIEWS = [DocusignSignView, DocusignRecipientSignedView, DocusignReviewedSentView];
export const DOCU_SIGN_ROUTES: Routes = [
  { path: 'docusign-sign', component: DocusignSignView },
  { path: 'docusign-recipient-signed', component: DocusignRecipientSignedView },
  { path: 'reviewed-and-sent', component: DocusignReviewedSentView },
];
