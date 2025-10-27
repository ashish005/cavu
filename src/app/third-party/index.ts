import {Routes} from "@angular/router";
import {DOCU_SIGN_ROUTES, DOCU_SIGN_VIEWS} from "./docu-sign/index";
import {DocuSignService} from "./docu-sign/services/docuSign.service";


export {IdentityModule} from "./identity/identity.module";

export {AuthGuard} from "./identity/guard/auth-guard.service";

export {AuthService} from "./identity/auth.service";
export {getAuthConfig} from "./identity/auth-config";

export const THIRD_PARTY_VIEWS = [DOCU_SIGN_VIEWS];
export const THIRD_PARTY_SERVICES = [DocuSignService];


export const THIRD_PARTY_ROUTES: Routes = [
  ...DOCU_SIGN_ROUTES,
];
