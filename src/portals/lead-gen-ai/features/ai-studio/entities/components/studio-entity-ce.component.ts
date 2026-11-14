import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudioEntityService } from '../services/studio-entity.service';
import { StudioEntityModel } from '../domains/studio-entity.domain';
import { AiStudioService } from '../../ai-studio.service';

/** Create/Edit popup for StudioEntity — right-aligned panel per app convention. */
@Component({
  selector: 'app-studio-entity-ce',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="ce">
    <h3>{{ model.id ? 'Edit entity' : 'New entity' }}</h3>
    <div class="f"><label>Name *</label><input [(ngModel)]="model.name"/></div>
    <div class="f"><label>Classification *</label>
      <select [(ngModel)]="model.classification">
        <option *ngFor="let c of classes" [value]="c">{{ c }}</option>
      </select></div>
    <div class="row">
      <div class="f"><label>Score (0-100)</label><input type="number" [(ngModel)]="model.score" min="0" max="100"/></div>
      <div class="f"><label>Stage</label>
        <select [(ngModel)]="model.stage"><option *ngFor="let s of stages" [value]="s">{{ s }}</option></select></div>
    </div>
    <div class="f"><label>Source</label><input [(ngModel)]="model.source"/></div>
    <div class="f"><label>Contact name</label><input [(ngModel)]="contactName"/></div>
    <div class="f"><label>Contact email</label><input [(ngModel)]="contactEmail"/></div>
    <small class="err" *ngIf="err">{{ err }}</small>
    <div class="foot">
      <button class="btn" (click)="cancel()">Cancel</button>
      <button class="btn primary" [disabled]="busy" (click)="save()">{{ model.id ? 'Save changes' : 'Create' }}</button>
    </div>
  </div>`,
  styles: [`
    .ce{padding:16px;min-width:360px}
    h3{margin:0 0 14px;font-size:16px}
    .f{margin-bottom:12px}.f label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    input,select{width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid var(--border,#ddd);background:var(--bg,#fff);color:inherit;font-size:13px}
    .err{color:#c0392b}.foot{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
    .btn{padding:8px 16px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn:disabled{opacity:.5}
  `]
})
export class StudioEntityCeComponent {
  get stages() { return this.studio.industry?.stages ?? []; }
  classes = ['Prospect', 'Customer', 'Candidate', 'Employer', 'Opportunity'];
  model = new StudioEntityModel();
  contactName = ''; contactEmail = '';
  err = ''; busy = false;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  constructor(private svc: StudioEntityService, private studio: AiStudioService) {}

  // inputs assigned by PopupNormalComponent: id, data, actionType
  id?: string | null;
  data?: any;
  actionType?: string;

  ngOnInit() {
    if (this.data) {
      this.model = new StudioEntityModel(this.data);
      this.contactName = this.model.contact?.name ?? '';
      this.contactEmail = this.model.contact?.email ?? '';
    } else {
      this.model.classification = 'Prospect';
      this.model.score = 50;
      this.model.stage = this.studio.industry?.stages?.[0] ?? 'Lead';
    }
  }

  async save() {
    if (!this.model.name?.trim()) { this.err = 'Name is required'; return; }
    this.model.contactJson = this.contactName || this.contactEmail
      ? JSON.stringify({ name: this.contactName, role: '', email: this.contactEmail }) : undefined;
    this.busy = true; this.err = '';
    try {
      await this.svc.save(this.model).toPromise();
      this.onOk.emit(this.model);
    } catch (e: any) { this.err = e?.error?.detail ?? e?.message ?? 'Save failed'; }
    finally { this.busy = false; }
  }
  cancel() { this.onCancel.emit(null); }
}
