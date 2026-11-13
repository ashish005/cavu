import { Component, EventEmitter, Output } from '@angular/core';

export interface EntityFormField {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'datetime';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

/**
 * Generic entity form popup (fallback for entities without a dedicated
 * popup). PopupNormalComponent assigns parameters directly onto this
 * instance: fields, submitLabel, initialValues, onSubmit.
 */
@Component({
  selector: 'lead-gen-entity-form-popup',
  template: `
    <div class="efp">
      <div class="efp-fields">
        <label *ngFor="let f of fields" class="efp-field">
          <span>{{ f.label }}<em *ngIf="f.required">*</em></span>
          <select *ngIf="f.type === 'select'" [(ngModel)]="values[f.key]" [name]="f.key" [required]="f.required">
            <option value="">—</option>
            <option *ngFor="let o of f.options" [value]="o.value">{{ o.label }}</option>
          </select>
          <textarea *ngIf="f.type === 'textarea'" [(ngModel)]="values[f.key]" [name]="f.key" rows="3" [placeholder]="f.placeholder"></textarea>
          <input *ngIf="!f.type || f.type === 'text'" [(ngModel)]="values[f.key]" [name]="f.key" [type]="f.type === 'datetime' ? 'datetime-local' : 'text'" [placeholder]="f.placeholder" [required]="f.required" />
        </label>
      </div>
      <p class="efp-error" *ngIf="error">{{ error }}</p>
      <div class="efp-actions">
        <button type="button" class="efp-btn efp-btn-secondary" (click)="cancel()">Cancel</button>
        <button type="button" class="efp-btn efp-btn-primary" [disabled]="saving" (click)="submit()">{{ saving ? 'Saving…' : submitLabel }}</button>
      </div>
    </div>
  `,
  styles: [`
    .efp { padding: 8px 4px; }
    .efp-fields { display: flex; flex-direction: column; gap: 12px; }
    .efp-field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600; color: #334155;
      em { color: #dc2626; font-style: normal; }
      input, select, textarea { padding: 9px 11px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-weight: 400; }
      input:focus, select:focus, textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
    }
    .efp-error { color: #b91c1c; font-size: 13px; margin: 8px 0 0; }
    .efp-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .efp-btn { border-radius: 8px; padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .efp-btn-primary { background: #2563eb; color: #fff; border: none; }
    .efp-btn-primary:disabled { opacity: .6; }
    .efp-btn-secondary { background: #fff; color: #334155; border: 1px solid #cbd5e1; }
  `],
  standalone: false
})
export class LeadGenEntityFormPopupComponent {
  // assigned by PopupNormalComponent via Object.assign
  fields: EntityFormField[] = [];
  submitLabel = 'Save';
  initialValues?: Record<string, string>;
  onSubmit?: (values: Record<string, string>) => Promise<void> | void;

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  saving = false;
  error = '';
  private _values?: Record<string, string>;

  get values(): Record<string, string> {
    if (!this._values) {
      this._values = {};
      (this.fields ?? []).forEach(f => { this._values![f.key] = this.initialValues?.[f.key] ?? ''; });
    }
    return this._values;
  }

  cancel(): void { this.onCancel.emit(null); }

  submit(): void {
    const missing = (this.fields ?? []).some(f => f.required && !(this.values[f.key] ?? '').trim());
    if (missing) { this.error = 'Please fill in all required fields.'; return; }
    this.saving = true;
    this.error = '';
    Promise.resolve(this.onSubmit?.({ ...this.values }))
      .then(() => { this.saving = false; this.onOk.emit({ ...this.values }); })
      .catch((e: any) => { this.saving = false; this.error = e?.message || 'Save failed.'; });
  }
}
