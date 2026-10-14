import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {OrgSetupAPIResolver} from "./services/api.resolver";
import {OrgWizardService} from "./services/org-wizard.service";
import {wizardStepGuard} from "./services/wizard-step.guard";
import {OrgWizardLayout} from "./layout/org-wizard-layout";
import {OrgConfigView} from "./views/org-config.view";
import {BranchSetupView} from "./views/branch-setup.view";
import {SeedApplicationView} from "./views/seed-application.view";
import {FinalizeSetupView} from "./views/finalize-setup.view";
import {SeedStatusComponent} from "./components/seed-status.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: "",
                resolve: {items: OrgSetupAPIResolver},
                component: OrgWizardLayout,
                children: [
                    {path: "", redirectTo: "config", pathMatch: "full"},
                    {path: "config", component: OrgConfigView, canActivate: [wizardStepGuard]},
                    {path: "branch", component: BranchSetupView, canActivate: [wizardStepGuard]},
                    {path: "seed", component: SeedApplicationView, canActivate: [wizardStepGuard]},
                    {path: "finalize", component: FinalizeSetupView, canActivate: [wizardStepGuard]},
                    {path: "**", redirectTo: "config"}
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [OrgSetupAPIResolver, OrgWizardService],
    declarations: [
        OrgWizardLayout,
        OrgConfigView,
        BranchSetupView,
        SeedApplicationView,
        FinalizeSetupView,
        SeedStatusComponent
    ]
})
export class OrgCoreSetupModule {}
