import {Component, DestroyRef, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {AppSetupService} from "@app-global";
import {OrgWizardService, WizardState, WizardStep, WizardStepKey} from "../services/org-wizard.service";

@Component({
    standalone: false,
    templateUrl: "./templates/org-wizard-layout.html",
    styleUrls: ["./templates/org-wizard-layout.css"]
})
export class OrgWizardLayout {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    wizardState: WizardState;

    constructor(
        public wizardService: OrgWizardService,
        public setupService: AppSetupService,
        private route: ActivatedRoute
    ) {
        this.wizardService.state$
            .pipe(takeUntilDestroyed(inject(DestroyRef)))
            .subscribe(state => this.wizardState = state);
    }

    get steps() { return this.wizardService.steps; }
    get progressPercentage(): number { return this.wizardService.progressPercentage; }
    get currentIndex(): number { return this.wizardService.indexOf(this.wizardState.currentStep); }

    navigateToStep(key: WizardStepKey) {
        if (this.wizardState.isCompleted || !this.wizardService.isAccessible(key)) { return; }
        this.wizardService.goTo(key, this.route, true);
    }

    getStepClass(step: WizardStep): string {
        if (step.key === this.wizardState.currentStep) return 'current';
        const status = this.wizardState.status[step.key];
        if (status === 'completed') return 'completed';
        if (status === 'skipped') return 'skipped';
        return this.wizardService.isAccessible(step.key) ? 'accessible' : 'disabled';
    }

    goPrevious() {
        const prev = this.wizardService.previousOf(this.wizardState.currentStep);
        if (prev) { this.navigateToStep(prev); }
    }

    goNext() {
        const next = this.wizardService.nextOf(this.wizardState.currentStep);
        if (next && this.canGoNext()) { this.navigateToStep(next); }
    }

    /** "Next" only moves past a step that is already done; each step's own action completes it. */
    canGoNext(): boolean {
        const next = this.wizardService.nextOf(this.wizardState.currentStep);
        return !!next && this.wizardService.isAccessible(next);
    }

    canGoPrevious(): boolean {
        return !this.wizardState.isCompleted && this.currentIndex > 0;
    }

    trackByKey = (_: number, step: WizardStep) => step.key;
}
