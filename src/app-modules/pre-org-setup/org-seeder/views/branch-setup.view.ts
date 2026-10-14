import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppSetupService} from "@app-global";
import {OrgWizardService} from "../services/org-wizard.service";

/**
 * Branches are created during tenant registration and there is no branch create/update
 * API on the tenant service yet, so this step selects which existing branch gets seeded.
 * Branch details are edited from the admin panel after setup.
 */
@Component({
    standalone: false,
    selector: 'branch-setup',
    templateUrl: './templates/branch-setup.html',
    styleUrls: ['./templates/wizard-steps.css']
})
export class BranchSetupView implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    branches: any[] = [];
    selectedBranchId: string | null = null;

    constructor(
        public wizardService: OrgWizardService,
        public coreService: AppSetupService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        const setup = this.coreService.appSetup;
        this.branches = [...(setup?.branches || [])]
            .sort((a, b) => Number(!!b.isHeadBranch) - Number(!!a.isHeadBranch));

        const saved = this.wizardService.state.branchId;
        const initial = this.branches.find(b => b.id === saved) ?? setup?.getDefaultHeadBranch() ?? this.branches[0];
        this.selectedBranchId = initial?.id ?? null;
    }

    get selectedBranch() { return this.branches.find(b => b.id === this.selectedBranchId); }

    select(branch: any) { this.selectedBranchId = branch.id; }

    onContinue() {
        if (!this.selectedBranch) { return; }
        const changed = this.wizardService.state.branchId !== this.selectedBranchId;
        this.wizardService.complete('branch', {
            branchId: this.selectedBranchId,
            // Seeding was done against another branch; it needs to be redone for this one.
            ...(changed ? this.resetDownstream() : {})
        });
        this.wizardService.goNext('branch', this.route);
    }

    private resetDownstream() {
        const state = this.wizardService.state;
        return {
            status: {...state.status, seed: 'pending' as const},
            seedConfig: {...state.seedConfig, queuedAt: null}
        };
    }

    trackById = (_: number, branch: any) => branch.id;
}
