import {OrgProcessView} from "./views/org-process.view";
import {OrgProcessCeView} from "./views/org-process-ce.view";
import {OrgProcessTransitioningCeView} from "./views/org-process-transitioning-ce.view";

export {OrgProcessView} from "./views/org-process.view";
export const ORG_PROCESS_VIEWS = [
    OrgProcessView,
    OrgProcessCeView, OrgProcessTransitioningCeView
];