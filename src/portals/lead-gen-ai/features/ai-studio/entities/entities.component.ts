import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, StudioEntity, Evidence } from '../ai-studio.service';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="ent">
    <div class="head"><h2>Entity Database</h2>
      <div class="filters">
        <button *ngFor="let c of classes" class="chip" [class.on]="cls===c" (click)="setCls(c)">{{ c }}</button>
        <select [(ngModel)]="sortBy"><option value="score">Score</option><option value="name">Name</option></select>
      </div>
    </div>
    <table><thead><tr><th>Name</th><th>Class</th><th>Score</th><th>Stage</th><th>Source</th><th></th></tr></thead>
    <tbody><tr *ngFor="let e of shown" (click)="sel=e">
      <td><b>{{ e.name }}</b><div class="muted">{{ contact(e) }}</div></td>
      <td><span class="badge">{{ e.classification }}</span></td>
      <td><div class="score" [style.width.%]="e.score"></div>{{ e.score }}</td>
      <td>{{ e.stage }}</td><td class="muted">{{ e.source }}</td>
      <td><button class="btn" (click)="next(e);$event.stopPropagation()">→</button></td>
    </tr></tbody></table>
    <p class="muted" *ngIf="!shown.length">No entities — run discovery first.</p>

    <aside class="dossier" *ngIf="sel">
      <div class="d-head"><h3>{{ sel.name }}</h3><button class="btn" (click)="sel=null">✕</button></div>
      <p class="muted">{{ sel.classification }} · score {{ sel.score }} · {{ sel.stage }}</p>
      <h4>Evidence</h4>
      <div class="ev" *ngFor="let ev of evidence(sel)">
        <span [class.v]="ev.verified">{{ ev.verified ? '✓' : '○' }}</span> {{ ev.label }}
        <small class="muted">{{ ev.source }}</small>
        <button class="mini" (click)="verify(sel, ev)">{{ ev.verified ? 'Verified' : 'Verify' }}</button>
      </div>
      <h4>Contacts</h4><p class="muted">{{ contact(sel) || '—' }}</p>
    </aside>
  </div>`,
  styles: [`
    .ent{padding:16px;max-width:1100px;margin:0 auto;position:relative}
    .head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .filters{display:flex;gap:6px;align-items:center}.chip{padding:4px 10px;border-radius:14px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .chip.on{background:#3467d6;color:#fff;border-color:#3467d6}
    select{padding:5px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:7px 8px;border-bottom:1px solid var(--border,#f0f0f0);text-align:left}
    .badge{font-size:11px;background:#eef3ff;color:#3467d6;border-radius:10px;padding:2px 8px}
    .score{height:4px;background:#3467d6;border-radius:2px;margin-bottom:2px}
    .btn{padding:4px 10px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .muted{color:var(--muted,#888);font-size:12px}
    .dossier{position:fixed;right:0;top:0;bottom:0;width:340px;background:var(--card,#fff);border-left:1px solid var(--border,#eee);padding:16px;overflow:auto;box-shadow:-4px 0 16px rgba(0,0,0,.08)}
    .d-head{display:flex;justify-content:space-between;align-items:center}h4{margin:14px 0 6px;font-size:13px}
    .ev{padding:6px 0;border-bottom:1px solid var(--border,#f5f5f5);font-size:13px}.ev .v{color:#1a9e5c}.ev small{display:block}.mini{font-size:11px;padding:2px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
  `]
})
export class EntitiesComponent implements OnInit {
  studio = inject(AiStudioService);
  classes = ['', 'Prospect', 'Customer', 'Candidate', 'Employer', 'Opportunity'];
  cls = ''; sortBy = 'score'; sel?: StudioEntity; entities: StudioEntity[] = [];
  get shown() {
    const list = this.entities.filter(e => !this.cls || e.classification === this.cls);
    return [...list].sort((a, b) => this.sortBy === 'name' ? a.name.localeCompare(b.name) : b.score - a.score);
  }
  ngOnInit() { this.studio.entities$.subscribe(e => this.entities = e); this.studio.listEntities().subscribe(); }
  setCls(c: string) { this.cls = c; this.studio.listEntities(c || undefined).subscribe(); }
  evidence(e: StudioEntity): Evidence[] { return this.studio.evidenceOf(e); }
  contact(e: StudioEntity) { try { const c = JSON.parse(e.contactJson || 'null'); return c ? `${c.name} · ${c.role}` : ''; } catch { return ''; } }
  next(e: StudioEntity) {
    const stages = this.studio.industry.stages; const i = stages.indexOf(e.stage);
    this.studio.moveStage(e.id, stages[Math.min(i + 1, stages.length - 1)]).subscribe();
  }
  verify(e: StudioEntity, ev: Evidence) {
    ev.verified = true;
    const json = JSON.stringify(this.evidence(e));
    this.studio.createEntity({ ...e, evidenceJson: json } as any).subscribe();
  }
}
