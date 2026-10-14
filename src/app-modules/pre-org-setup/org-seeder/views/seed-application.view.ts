import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {AlertService, AppSetupService, MessageSeverity} from "@app-global";
import {OrgWizardService} from "../services/org-wizard.service";
import {BranchSeedStatus, OrgSettingService, errorMessageOf} from "../services/org-setting.service";
import {SeedStatusComponent} from "../components/seed-status.component";

@Component({
    standalone: false,
    selector: 'seed-application',
    templateUrl: './templates/seed-application.html',
    styleUrls: ['./templates/wizard-steps.css'],
    providers: [OrgSettingService]
})
export class SeedApplicationView implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    @ViewChild(SeedStatusComponent) statusView?: SeedStatusComponent;

    customForm: FormGroup;
    submitting = false;
    errorMessage: string | null = null;
    seedStatus: BranchSeedStatus | null = null;

    constructor(
        public fb: FormBuilder,
        public wizardService: OrgWizardService,
        public coreService: AppSetupService,
        public service: OrgSettingService,
        private alertService: AlertService,
        private route: ActivatedRoute
    ) {
        this.customForm = this.fb.group({
            applyMasterSeed: [true],
            applyDemoSeed: [false]
        });
    }

    get branch() {
        return this.coreService.appSetup?.getActiveBranchById(this.wizardService.state.branchId);
    }

    get queuedAt(): string | null { return this.wizardService.state.seedConfig.queuedAt; }
    get stepDone(): boolean { return this.wizardService.isDone('seed'); }

    get isSeeded(): boolean { return this.seedStatus?.status === 'Completed'; }

    /** A request is with the worker; queueing again or skipping now would race it. */
    get inProgress(): boolean {
        const s = this.seedStatus;
        return !!s && (s.status === 'Queued' || s.status === 'Processing' || (s.status === 'Pending' && !!s.requestedAt));
    }

    get canQueue(): boolean { return this.hasSelection && !this.submitting && !this.inProgress && !this.isSeeded; }
    get canSkip(): boolean { return !this.submitting && !this.queuedAt && !this.inProgress && !this.isSeeded; }

    get hasSelection(): boolean {
        const {applyMasterSeed, applyDemoSeed} = this.customForm.value;
        return !!(applyMasterSeed || applyDemoSeed);
    }

    get demoWithoutMaster(): boolean {
        const {applyMasterSeed, applyDemoSeed} = this.customForm.value;
        return !!applyDemoSeed && !applyMasterSeed;
    }

    ngOnInit() {
        const {applyMasterSeed, applyDemoSeed} = this.wizardService.state.seedConfig;
        this.customForm.patchValue({applyMasterSeed, applyDemoSeed});
    }

    toggle(control: 'applyMasterSeed' | 'applyDemoSeed') {
        if (this.submitting) { return; }
        const c = this.customForm.get(control)!;
        c.setValue(!c.value);
    }

    onStatus(status: BranchSeedStatus) {
        this.seedStatus = status;
        // Branch was already seeded (e.g. during registration): nothing left to do in this step.
        if (status.status === 'Completed' && !this.stepDone) {
            this.wizardService.complete('seed', {
                seedConfig: {applyMasterSeed: status.applyMasterSeed, applyDemoSeed: status.applyDemoSeed, queuedAt: status.requestedAt}
            });
        }
    }

    onSubmit() {
        if (!this.canQueue) { return; }

        const branch = this.branch;
        const orgId = this.coreService.appSetup?.id;
        if (!branch || !orgId) {
            this.errorMessage = 'No branch selected. Go back to the Branch step and pick one.';
            return;
        }

        const {applyMasterSeed, applyDemoSeed} = this.customForm.value;
        this.submitting = true;
        this.errorMessage = null;

        this.service.queueTenantSeed({orgId, orgBranchId: branch.id, applyMasterSeed: !!applyMasterSeed, applyDemoSeed: !!applyDemoSeed})
            .pipe(finalize(() => this.submitting = false))
            .subscribe({
                next: () => {
                    this.wizardService.complete('seed', {
                        seedConfig: {applyMasterSeed: !!applyMasterSeed, applyDemoSeed: !!applyDemoSeed, queuedAt: new Date().toISOString()}
                    });
                    this.alertService.showMessage('Seed data', 'Seed request queued. Progress is shown below.', MessageSeverity.success);
                    this.statusView?.restart();
                },
                error: (err) => {
                    this.errorMessage = errorMessageOf(err, 'Failed to queue seed data. Please try again.');
                }
            });
    }

    continue() {
        this.wizardService.goNext('seed', this.route);
    }

    skipStep() {
        if (!this.canSkip) { return; }
        this.wizardService.skip('seed', {
            seedConfig: {applyMasterSeed: false, applyDemoSeed: false, queuedAt: null}
        });
        this.wizardService.goNext('seed', this.route);
    }
}
