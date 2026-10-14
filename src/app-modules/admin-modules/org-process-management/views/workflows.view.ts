import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {ProcessLookups, WorkflowSummary} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/** Workflow templates: the stages a process goes through and the tasks each stage creates. */
@Component({standalone: false, templateUrl: './templates/workflows.html'})
export class WorkflowsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    lookups: ProcessLookups | null = null;
    rows: WorkflowSummary[] = [];
    loading = false;
    error: string | null = null;

    constructor(private api: ProcessApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        this.load();
    }

    load() {
        this.loading = true;
        this.api.workflows(true).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.rows = r,
            error: e => this.error = errorMessageOf(e, 'Could not load workflows.')
        });
    }

    remove(w: WorkflowSummary, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (!confirm(`Delete the workflow "${w.name}"?`)) { return; }
        this.api.deleteWorkflow(w.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.load(),
            error: e => this.error = errorMessageOf(e, 'The workflow could not be deleted.')
        });
    }

    trackById(_: number, r: {id: string}) { return r.id; }
}
