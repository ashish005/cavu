import { Component, Input, OnInit } from '@angular/core';

export interface EntityFormField {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'datetime';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

@Component({
  selector: 'lead-gen-entity-form-popup',
  template: `
    <form (ngSubmit)="submit()" class="efp">
      <p class="efp-error" *ngIf="error">{{ error }}</p>
      <label *ngFor="let f of fields" class="efp-field">
        <span>{{ f.label }}<em *ngIf="f.required"> *</em></span>
        <select *ngIf="f.type === 'select'" [(ngModel)]="values[f.key]" [name]="f.key" [required]="f.required">
          <option value="" *ngIf="!f.required">— Select —</option>
          <option *ngFor="let o of f.options" [value]="o.value">{{ o.label }}</option>
        </select>
        <textarea *ngIf="f.type === 'textarea'" [(ngModel)]="values[f.key]" [name]="f.key" rows="3" [placeholder]="f.placeholder"></textarea>
        <input *ngIf="!f.type || f.type === 'text'" [(ngModel)]="values[f.key]" [name]="f.key" [type]="f.type === 'datetime' ? 'datetime-local' : 'text'" [placeholder]="f.placeholder" [required]="f.required" />
      </label>
      <div class="efp-actions">
        <button type="button" class="efp-btn efp-btn-secondary" (click)="parameters?.onCancel?.()">Cancel</button>
        <button type="submit" class="efp-btn efp-btn-primary" [disabled]="saving">{{ saving ? 'Saving…' : submitLabel }}</button>
      </div>
    </form>
  `,
  styles: [`
    .efp { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .efp-field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 600; color: #475569; }
    .efp-field em { color: #dc2626; font-style: normal; }
    .efp-field input, .efp-field select, .efp-field textarea {
      padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit;
    }
    .efp-error { color: #dc2626; font-size: 13px; margin: 0; }
    .efp-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    .efp-btn { border-radius: 8px; padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .efp-btn-primary { background: #2563eb; color: #fff; border: none; }
    .efp-btn-primary:disabled { opacity: .6; }
    .efp-btn-secondary { background: #fff; color: #334155; border: 1px solid #cbd5e1; }
  `],
  standalone: false
})
export class LeadGenEntityFormPopupComponent implements OnInit {
  @Input() parameters: any;
  fields: EntityFormField[] = [];
  values: Record<string, string> = {};
  submitLabel = 'Save';
  saving = false;
  error = '';

  ngOnInit(): void {
    const p = this.parameters ?? {};
    this.fields = p.fields ?? [];
    this.submitLabel = p.submitLabel ?? 'Save';
    this.values = {};
    this.fields.forEach(f => this.values[f.key] = '');
  }

  submit(): void {
    const missing = this.fields.some(f => f.required && !(this.values[f.key] ?? '').trim());
    if (missing) { this.error = 'Please fill in all required fields.'; return; }
    this.saving = true;
    this.error = '';
    Promise.resolve(this.parameters?.onSubmit?.({ ...this.values }))
      .then(() => { this.saving = false; })
      .catch((e: any) => { this.saving = false; this.error = e?.message ?? 'Save failed.'; });
  }
}
