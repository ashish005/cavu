import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {AppSetupService} from "@app-global";

export type WizardStepKey = 'config' | 'branch' | 'seed' | 'finalize';
export type WizardStepStatus = 'pending' | 'completed' | 'skipped';

export interface WizardStep {
    key: WizardStepKey;
    title: string;
    description: string;
    icon: string;
    optional: boolean;
}

export interface WizardState {
    currentStep: WizardStepKey;
    status: Record<WizardStepKey, WizardStepStatus>;
    isCompleted: boolean;
    orgConfig: any;
    branchId: string | null;
    seedConfig: {
        applyMasterSeed: boolean;
        applyDemoSeed: boolean;
        queuedAt: string | null;
    };
}

export const WIZARD_STEPS: ReadonlyArray<WizardStep> = [
    {key: 'config', title: 'Organization Configuration', description: 'Language, currency, timezone and calendar', icon: 'fa-cog', optional: false},
    {key: 'branch', title: 'Branch', description: 'Choose the branch to initialise', icon: 'fa-building', optional: false},
    {key: 'seed', title: 'Seed Data', description: 'Queue master and demo seed data', icon: 'fa-database', optional: true},
    {key: 'finalize', title: 'Finalize', description: 'Review and launch the application', icon: 'fa-check-circle', optional: false}
];

const STORAGE_PREFIX = 'org-setup-wizard:';

@Injectable()
export class OrgWizardService {
    readonly steps = WIZARD_STEPS;

    private readonly stateSubject: BehaviorSubject<WizardState>;
    readonly state$: Observable<WizardState>;

    constructor(private setupService: AppSetupService, private router: Router) {
        this.stateSubject = new BehaviorSubject<WizardState>(this.restore() ?? this.initialState());
        this.state$ = this.stateSubject.asObservable();
    }

    get state(): WizardState { return this.stateSubject.value; }

    getStep(key: WizardStepKey): WizardStep { return this.steps.find(s => s.key === key)!; }
    indexOf(key: WizardStepKey): number { return this.steps.findIndex(s => s.key === key); }

    isDone(key: WizardStepKey): boolean { return this.state.status[key] !== 'pending'; }

    /** A step is reachable once every step before it is completed or skipped. */
    isAccessible(key: WizardStepKey): boolean {
        return this.steps.slice(0, this.indexOf(key)).every(s => this.isDone(s.key));
    }

    /** The furthest step the user is allowed to land on. */
    get firstOpenStep(): WizardStepKey {
        return (this.steps.find(s => !this.isDone(s.key)) ?? this.steps[this.steps.length - 1]).key;
    }

    get progressPercentage(): number {
        const done = this.steps.filter(s => this.isDone(s.key)).length;
        return Math.round((done / this.steps.length) * 100);
    }

    nextOf(key: WizardStepKey): WizardStepKey | null { return this.steps[this.indexOf(key) + 1]?.key ?? null; }
    previousOf(key: WizardStepKey): WizardStepKey | null { return this.steps[this.indexOf(key) - 1]?.key ?? null; }

    setCurrent(key: WizardStepKey) {
        if (this.state.currentStep !== key) { this.patch({currentStep: key}); }
    }

    complete(key: WizardStepKey, patch: Partial<WizardState> = {}) { this.markStep(key, 'completed', patch); }
    skip(key: WizardStepKey, patch: Partial<WizardState> = {}) { this.markStep(key, 'skipped', patch); }

    markFinished() {
        this.markStep('finalize', 'completed', {isCompleted: true});
        this.clearStorage();
    }

    /** Navigates to a sibling step. `from` is the ActivatedRoute of a step view, or of the layout when `fromLayout`. */
    goTo(key: WizardStepKey, from: ActivatedRoute, fromLayout = false) {
        return this.router.navigate([fromLayout ? key : `../${key}`], {relativeTo: from});
    }

    goNext(current: WizardStepKey, from: ActivatedRoute) {
        const next = this.nextOf(current);
        return next ? this.goTo(next, from) : Promise.resolve(false);
    }

    private markStep(key: WizardStepKey, status: WizardStepStatus, patch: Partial<WizardState>) {
        this.patch({...patch, status: {...(patch.status ?? this.state.status), [key]: status}});
    }

    private patch(patch: Partial<WizardState>) {
        const next = {...this.state, ...patch};
        this.stateSubject.next(next);
        this.persist(next);
    }

    private initialState(): WizardState {
        const status = {} as Record<WizardStepKey, WizardStepStatus>;
        this.steps.forEach(s => status[s.key] = 'pending');
        return {
            currentStep: 'config',
            status,
            isCompleted: false,
            orgConfig: null,
            branchId: null,
            seedConfig: {applyMasterSeed: true, applyDemoSeed: false, queuedAt: null}
        };
    }

    // Progress is kept per org in sessionStorage so a refresh or back navigation inside
    // the same tab does not throw the user back to step 1.
    private get storageKey() { return STORAGE_PREFIX + (this.setupService.appSetup?.id ?? 'anonymous'); }

    private restore(): WizardState | null {
        try {
            const raw = sessionStorage.getItem(this.storageKey);
            if (!raw) { return null; }
            const saved = JSON.parse(raw) as WizardState;
            const base = this.initialState();
            return {...base, ...saved, status: {...base.status, ...saved.status}};
        } catch {
            return null;
        }
    }

    private persist(state: WizardState) {
        try { sessionStorage.setItem(this.storageKey, JSON.stringify(state)); } catch { /* storage unavailable */ }
    }

    private clearStorage() {
        try { sessionStorage.removeItem(this.storageKey); } catch { /* storage unavailable */ }
    }
}
