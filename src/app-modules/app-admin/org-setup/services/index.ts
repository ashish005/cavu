import {OrgService} from "./org.service";
import {OrgSetupAPIResolver} from "./api.resolver";
import {OrgCurrencyService} from "./org-currency.service";
import {OrgLanguageService} from "./org-language.service";
import {OrgBranchService} from "./org-branch.service";
import {OrgSettingService} from "./org-setting.service";

export const ORG_SETUP_SERVICES = [
    OrgSetupAPIResolver,
    OrgService, OrgSettingService, OrgCurrencyService, OrgLanguageService, OrgBranchService
];
