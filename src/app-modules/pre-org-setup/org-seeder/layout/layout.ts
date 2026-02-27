import {Component, TemplateRef, ViewChild} from "@angular/core";
import {AppSetupService} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: "./templates/org.html"
})
export class OrgLayout {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    submitted: boolean = false;
    constructor(public setupService: AppSetupService, private router: Router, private route: ActivatedRoute) {
    }



    goStep(step: "config" | "sync" | "final") {
        const setup = this.setupService.appSetup;
        if (step === "sync" && !(setup && setup.orgConfig && setup.orgConfig.hasValidConfig())) {
            return;
        }
        if (step === "final" && !(setup && setup.hasValidOrgSetup && setup.hasValidOrgSetup())) {
            return;
        }
        this.router.navigate([step], {relativeTo: this.route});
    }
}
