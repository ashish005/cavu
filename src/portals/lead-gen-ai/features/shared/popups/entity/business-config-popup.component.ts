import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, BusinessProfile, ClientBusiness, Offering, TargetIndustry, IndustryPack } from '../../../../services/lead-gen-api.service';

/** Per-business configuration: profile, offerings, target industries, industry packs. */
@Component({
  selector: 'lead-gen-business-config-popup',
  template: `
    <div class="bc">
      <section class="bc-sec" *ngIf="business" [class.bc-focus]="focus==='business'">
        <h4>Business</h4>
        <div class="bc-row">
          <label>Name<input [(ngModel)]="bizName" /></label>
          <label>Slug<input [(ngModel)]="bizSlug" /></label>
        </div>
        <div class="bc-row">
          <label>Country<input [(ngModel)]="bizCountry" maxlength="2" /></label>
          <label>Timezone<input [(ngModel)]="bizTimezone" /></label>
          <button class="bc-btn" (click)="saveBusiness()">Save business</button>
        </div>
      </section>
      <section class="bc-sec" [class.bc-focus]="focus==='profile'">
        <h4>Profile</h4>
        <label>Description<textarea [(ngModel)]="description" rows="2"></textarea></label>
        <div class="bc-row">
          <label>Industry<input [(ngModel)]="industry" /></label>
          <label>Category<input [(ngModel)]="category" /></label>
          <button class="bc-btn" (click)="saveProfile()">Save</button>
        </div>
      </section>

      <section class="bc-sec" [class.bc-focus]="focus==='offerings'">
        <h4>Offerings</h4>
        <div class="bc-item" *ngFor="let o of offerings">
          <span>{{ o.name }} <em>({{ o.kind }})</em></span>
          <button class="bc-link" (click)="toggleOffering(o)">{{ o.isActive ? 'Deactivate' : 'Activate' }}</button>
        </div>
        <p class="bc-empty" *ngIf="!offerings.length">None yet.</p>
        <div class="bc-row">
          <input [(ngModel)]="offeringName" placeholder="Offering name" />
          <input [(ngModel)]="offeringKind" placeholder="Kind (service/product)" />
          <button class="bc-btn" (click)="addOffering()">+ Add</button>
        </div>
      </section>

      <section class="bc-sec" [class.bc-focus]="focus==='industries'">
        <h4>Target industries</h4>
        <div class="bc-item" *ngFor="let i of industries">
          <span>{{ i.industry }}</span>
          <button class="bc-link" (click)="removeIndustry(i)">Remove</button>
        </div>
        <p class="bc-empty" *ngIf="!industries.length">None yet.</p>
        <div class="bc-row">
          <input [(ngModel)]="newIndustry" placeholder="e.g. Healthcare" (keyup.enter)="addIndustry()" />
          <button class="bc-btn" (click)="addIndustry()">+ Add</button>
        </div>
      </section>

      <section class="bc-sec" [class.bc-focus]="focus==='packs'">
        <h4>Industry packs</h4>
        <div class="bc-item" *ngFor="let p of packs">
          <span>{{ p.name }} <em>({{ p.key }})</em></span>
          <button class="bc-link" [disabled]="p.installed" (click)="installPack(p)">{{ p.installed ? 'Installed' : 'Install' }}</button>
        </div>
        <p class="bc-empty" *ngIf="!packs.length">No packs available.</p>
      </section>

      <p class="bc-error" *ngIf="error">{{ error }}</p>
      <div class="bc-actions">
        <button class="bc-btn bc-secondary" (click)="onCancel.emit(null)">Close</button>
      </div>
    </div>
  `,
  styles: [`.bc { display:flex; flex-direction:column; gap:16px; padding:4px; }
    .bc-sec h4 { margin:0 0 8px; font-size:13px; font-weight:700; color:#0f172a; }
    .bc label { display:flex; flex-direction:column; gap:4px; font-size:12px; font-weight:600; color:#475569; margin-bottom:8px; }
    .bc input, .bc textarea { padding:8px 10px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; }
    .bc-row { display:flex; gap:8px; align-items:flex-end; }
    .bc-row input { flex:1; }
    .bc-item { display:flex; justify-content:space-between; align-items:center; padding:7px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:6px; font-size:13px; }
    .bc-item em { color:#64748b; font-style:normal; }
    .bc-empty { color:#94a3b8; font-size:12px; margin:4px 0; }
    .bc-btn { background:#2563eb; color:#fff; border:none; border-radius:8px; padding:8px 14px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; }
    .bc-btn:disabled { opacity:.5; }
    .bc-secondary { background:#fff; color:#334155; border:1px solid #cbd5e1; }
    .bc-link { background:none; border:none; color:#2563eb; font-size:12px; font-weight:600; cursor:pointer; }
    .bc-error { color:#b91c1c; font-size:13px; margin:0; }
    .bc-actions { display:flex; justify-content:flex-end; }
    .bc-focus { outline: 2px solid #2563eb; outline-offset: 4px; border-radius: 10px; padding: 10px; margin: -10px; }`],
  standalone: false
})
export class LeadGenBusinessConfigPopupComponent implements OnInit {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  focus = '';
  business?: ClientBusiness;
  submitLabel = 'Done';
  bizName = ''; bizSlug = ''; bizCountry = 'US'; bizTimezone = '';

  profile?: BusinessProfile;
  offerings: Offering[] = [];
  industries: TargetIndustry[] = [];
  packs: IndustryPack[] = [];

  description = ''; industry = ''; category = '';
  offeringName = ''; offeringKind = 'service';
  newIndustry = '';
  error = '';

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void { this.reload(); }

  reload(): void {
    if (this.business) { const b: any = this.business; this.bizName = b.name; this.bizSlug = b.slug; this.bizCountry = b.countryCode ?? 'US'; this.bizTimezone = b.defaultTimeZoneId ?? ''; }
    this.api.getBusinessConfiguration(this.clientBusinessId).subscribe({
      next: (c) => {
        this.profile = c.profile;
        this.description = c.profile?.description ?? ''; this.industry = c.profile?.industry ?? ''; this.category = c.profile?.category ?? '';
        this.offerings = c.offerings ?? []; this.industries = c.targetIndustries ?? []; this.packs = c.industryPacks ?? [];
      },
      error: () => undefined
    });
  }

  saveBusiness(): void {
    if (!this.business || !this.bizName.trim() || !this.bizSlug.trim()) return;
    this.api.updateClientBusiness(this.clientBusinessId, { name: this.bizName.trim(), slug: this.bizSlug.trim(), countryCode: this.bizCountry.trim().toUpperCase(), defaultTimeZoneId: this.bizTimezone } as any)
      .subscribe({ next: () => { this.error = ''; }, error: (e: HttpErrorResponse) => this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.' });
  }

  saveProfile(): void {
    this.api.updateBusinessProfile(this.clientBusinessId, { description: this.description || undefined, industry: this.industry || undefined, category: this.category || undefined })
      .subscribe({ next: () => { this.error = ''; }, error: (e: HttpErrorResponse) => this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.' });
  }

  addOffering(): void {
    if (!this.offeringName.trim()) return;
    this.api.createOffering(this.clientBusinessId, { name: this.offeringName.trim(), kind: this.offeringKind || 'service' })
      .subscribe({ next: () => { this.offeringName = ''; this.reload(); }, error: (e: HttpErrorResponse) => this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Add failed.' });
  }

  toggleOffering(o: Offering): void {
    this.api.setOfferingStatus(this.clientBusinessId, o.id, !o.isActive).subscribe({ next: () => this.reload(), error: () => undefined });
  }

  addIndustry(): void {
    if (!this.newIndustry.trim()) return;
    this.api.addTargetIndustry(this.clientBusinessId, this.newIndustry.trim()).subscribe({ next: () => { this.newIndustry = ''; this.reload(); }, error: (e: HttpErrorResponse) => this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Add failed.' });
  }

  removeIndustry(i: TargetIndustry): void {
    this.api.removeTargetIndustry(this.clientBusinessId, i.id).subscribe({ next: () => this.reload(), error: () => undefined });
  }

  installPack(p: IndustryPack): void {
    this.api.installIndustryPack(this.clientBusinessId, p.key).subscribe({ next: () => this.reload(), error: (e: HttpErrorResponse) => this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Install failed.' });
  }
}
