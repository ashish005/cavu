import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { skip } from 'rxjs/operators';
import { AiStudioService, Run } from '../../ai-studio.service';
import { DiscoveryRunsComponent } from '../runs/discovery-runs.component';
import { srcs } from '../discovery.shared';

/** Discovery → Runs & Attribution Log (independent child route). */
@Component({
  selector: 'app-discovery-runs-view',
  standalone: true,
  imports: [CommonModule, FormsModule, DiscoveryRunsComponent],
  template: `
  <div>
    <div class="page-head">
      <div><h1>Discovery Runs &amp; Attribution</h1><p class="sub">Audit log of executed scans with qualified counts and re-run</p></div>
      <button class="btn" (click)="loadRuns()">↻ Refresh</button>
    </div>
    <app-discovery-runs [runs]="runs" [loading]="loading" [page]="page" [perPage]="perPage" [total]="total"
      (pageChange)="onPage($event)" (rerun)="rerun($event)"></app-discovery-runs>
  </div>`
})
export class DiscoveryRunsViewComponent implements OnInit {
  studio = inject(AiStudioService);
  runs: Run[] = []; loading = false; page = 1; perPage = 25; total = 0; scanning = false;

  ngOnInit() {
    this.loadRuns();
    this.studio.reloaded$.pipe(skip(1)).subscribe(() => this.loadRuns());
  }
  loadRuns() {
    this.loading = true;
    this.studio.listRuns(this.page, this.perPage).subscribe({
      next: p => { this.runs = p.items; this.total = p.totalCount; this.loading = false; },
      error: () => this.loading = false,
    });
  }
  onPage(e: { skip: number; take: number }) { this.perPage = e.take; this.page = Math.floor(e.skip / e.take) + 1; this.loadRuns(); }
  rerun(r: Run) {
    let srcs: string[] = []; try { srcs = JSON.parse(r.sourcesJson); } catch { }
    this.scanning = true;
    this.studio.runDiscovery(r.query, srcs, r.geography || 'Global', undefined, undefined)
      .subscribe(() => { this.scanning = false; this.loadRuns(); });
  }
}
