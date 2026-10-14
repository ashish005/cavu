import {Component, DestroyRef, TemplateRef, ViewChild, inject} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {Observable, finalize, of} from "rxjs";
import {AppSetupService} from "@app-global";
import {OrgWizardService, WizardState, WizardStepKey} from "../services/org-wizard.service";
import {BranchSeedStatus, OrgSettingService, errorMessageOf} from "../services/org-setting.service";

const APP_HOME = '/app';

@Component({
    standalone: false,
    selector: 'finalize-setup',
    templateUrl: './templates/finalize-setup.html',
    styleUrls: ['./templates/wizard-steps.css'],
    providers: [OrgSettingService]
})
export class FinalizeSetupView {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    wizardState: WizardState;
    isFinalizing = false;
    errorMessage: string | null = null;

    constructor(
        public wizardService: OrgWizardService,
        public coreService: AppSetupService,
        public service: OrgSettingService,
        private route: ActivatedRoute
    ) {
        this.wizardService.state$
            .pipe(takeUntilDestroyed(inject(DestroyRef)))
            .subscribe(state => this.wizardState = state);
    }

    get branch() { return this.coreService.appSetup?.getActiveBranchById(this.wizardState.branchId); }
    get orgConfig() { return this.wizardState.orgConfig || {}; }
    get seedConfig() { return this.wizardState.seedConfig; }

    seedStatus: BranchSeedStatus | null = null;
    launchAnyway = false;

    get seedSkipped(): boolean { return this.statusOf('seed') === 'skipped'; }
    get seedReady(): boolean { return this.seedSkipped || this.seedStatus?.status === 'Completed'; }
    get seedFailed(): boolean { return !this.seedSkipped && this.seedStatus?.status === 'Failed'; }

    /** Launching before seeding finishes opens an app without master data, so it needs an explicit opt-in. */
    get canFinalize(): boolean { return !this.isFinalizing && (this.seedReady || this.launchAnyway); }

    onSeedStatus(status: BranchSeedStatus) { this.seedStatus = status; }

    get summarySteps() {
        return this.wizardService.steps.filter(s => s.key !== 'finalize');
    }

    get stepsDone(): number {
        return this.summarySteps.filter(s => this.wizardService.isDone(s.key)).length;
    }

    statusOf(key: WizardStepKey) { return this.wizardState.status[key]; }

    badgeClass(key: WizardStepKey): string {
        switch (this.statusOf(key)) {
            case 'completed': return 'badge-success';
            case 'skipped': return 'badge-warning';
            default: return 'badge-secondary';
        }
    }

    get seedBadgeClass(): string {
        if (this.seedSkipped) return 'badge-warning';
        switch (this.seedStatus?.status) {
            case 'Completed': return 'badge-success';
            case 'Failed': return 'badge-danger';
            default: return 'badge-info';
        }
    }

    edit(key: WizardStepKey) {
        if (!this.isFinalizing && !this.wizardState.isCompleted) { this.wizardService.goTo(key, this.route); }
    }

    finalizeSetup() {
        if (!this.canFinalize) { return; }
        const branch = this.branch;
        if (!branch) {
            this.errorMessage = 'No branch selected. Go back to the Branch step and pick one.';
            return;
        }

        this.isFinalizing = true;
        this.errorMessage = null;

        // When seeding was queued the worker marks the branch Completed itself; calling
        // seed/success now would flip it out of Pending before the worker picks it up.
        const request$: Observable<any> = this.seedSkipped
            ? this.service.markSeedSuccess(branch.id)
            : of(null);

        request$.pipe(finalize(() => this.isFinalizing = false)).subscribe({
            next: () => {
                this.wizardService.markFinished();
                // Full reload: portal routes are computed once at bootstrap from the org setup.
                setTimeout(() => this.goToApp(), 1500);
            },
            error: (err) => this.errorMessage = errorMessageOf(err, 'Failed to finalize setup. Please try again.')
        });
    }

    goToApp() { location.href = APP_HOME; }
}
