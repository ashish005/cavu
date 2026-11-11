import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  BusinessProfile, ClientBusiness, CreateClientBusinessRequest, CreateWorkspaceRequest, IndustryPack,
  LeadGenApiService, OfferingRequest, Organization, TargetIndustry, Workspace
} from '../services/lead-gen-api.service';

type StepKey = 'organization' | 'business' | 'workspace' | 'configure' | 'launch';

interface StepDef { key: StepKey; title: string; subtitle: string; }

@Component({
  selector: 'app-lead-gen-setup',
  standalone: false,
  templateUrl: './lead-gen-setup.component.html',
  styleUrls: ['./lead-gen-setup.component.scss']
})
export class LeadGenSetupComponent implements OnInit {
  readonly steps: StepDef[] = [
    { key: 'organization', title: 'Organization', subtitle: 'Your company profile' },
    { key: 'business', title: 'Client business', subtitle: 'The business you sell for' },
    { key: 'workspace', title: 'Workspace', subtitle: 'Where your team works' },
    { key: 'configure', title: 'Configure', subtitle: 'Profile, offerings, industries' },
    { key: 'launch', title: 'Go live', subtitle: 'Seed demo data or add a lead' }
  ];

  currentStep = 0;
  completedSteps = new Set<StepKey>();

  // Step 1 — organization
  organization?: Organization;
  orgMissing = false;
  orgForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    defaultTimeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]]
  });

  // Step 2 — client business
  businesses: ClientBusiness[] = [];
  selectedBusinessId = '';
  businessForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    countryCode: ['US', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]],
    defaultTimeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]]
  });

  // Step 3 — workspace
  workspaces: Workspace[] = [];
  selectedWorkspaceId = '';
  workspaceForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    timeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]]
  });

  // Step 4 — configuration
  businessProfile?: BusinessProfile;
  offerings: { id: string; name: string; kind: string }[] = [];
  industries: TargetIndustry[] = [];
  profileForm = this.fb.nonNullable.group({
    description: ['', Validators.maxLength(2000)],
    industry: ['', Validators.maxLength(120)],
    category: ['', Validators.maxLength(120)]
  });
  offeringForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    kind: this.fb.nonNullable.control('Service'),
    description: ['']
  });
  industryInput = '';
  industryPacks: IndustryPack[] = [];
  installingPack = '';

  // Step 5 — launch
  seeding = false;
  seededCount: number | null = null;
  leadForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', Validators.email],
    phone: ['', Validators.maxLength(50)],
    industry: ['', Validators.maxLength(120)]
  });
  leadCreated = false;

  loading = false;
  saving = false;
  error = '';
  message = '';

  constructor(private readonly api: LeadGenApiService, private readonly fb: FormBuilder) {}

  get step(): StepKey { return this.steps[this.currentStep].key; }
  get selectedBusiness(): ClientBusiness | undefined {
    return this.businesses.find(b => b.id === this.selectedBusinessId);
  }
  get canSeed(): boolean {
    const role = this.selectedBusiness?.currentUserRole;
    return !!this.selectedBusiness?.canManage || role === 'Editor' || role === 'ClientAdmin';
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      org: this.api.getOrganization().pipe(catchError(() => of(null))),
      businesses: this.api.listClientBusinesses().pipe(catchError(() => of([] as ClientBusiness[]))),
      workspaces: this.api.listWorkspaces().pipe(catchError(() => of([] as Workspace[])))
    }).pipe(finalize(() => this.loading = false)).subscribe({
      next: ({ org, businesses, workspaces }) => {
        this.organization = org ?? undefined;
        this.orgMissing = !org;
        if (org) {
          this.orgForm.setValue({ name: org.name, slug: org.slug, defaultTimeZoneId: org.defaultTimeZoneId });
        }
        this.businesses = businesses;
        if (!this.selectedBusinessId && businesses.length) this.selectedBusinessId = businesses[0].id;
        this.workspaces = workspaces;
        if (!this.selectedWorkspaceId && workspaces.length) this.selectedWorkspaceId = workspaces[0].id;
        this.loadConfiguration();
      },
      error: () => this.error = 'Could not load your setup data. Check your session and try again.'
    });
  }

  // ---------- navigation ----------
  canContinue(): boolean {
    switch (this.step) {
      case 'organization': return !!this.organization || this.orgForm.valid;
      case 'business': return !!this.selectedBusinessId || this.businessForm.valid;
      case 'workspace': return !!this.selectedWorkspaceId || this.workspaceForm.valid;
      case 'configure': return true; // optional step
      case 'launch': return this.seededCount !== null || this.leadCreated;
    }
  }

  next(): void {
    if (!this.canContinue()) {
      this.markCurrentTouched();
      return;
    }
    this.error = '';
    this.message = '';
    if (this.step === 'organization' && !this.organization) this.saveOrganization();
    else if (this.step === 'business' && !this.selectedBusinessId) this.saveBusiness();
    else if (this.step === 'workspace' && !this.selectedWorkspaceId) this.saveWorkspace();
    else {
      this.completedSteps.add(this.step);
      this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
      if (this.step === 'configure') this.loadConfiguration();
    }
  }

  back(): void {
    this.currentStep = Math.max(0, this.currentStep - 1);
    this.error = '';
    this.message = '';
  }

  goTo(index: number): void {
    if (index <= this.currentStep || this.completedSteps.has(this.steps[index].key)) {
      this.currentStep = index;
    }
  }

  private markCurrentTouched(): void {
    if (this.step === 'organization') this.orgForm.markAllAsTouched();
    if (this.step === 'business') this.businessForm.markAllAsTouched();
    if (this.step === 'workspace') this.workspaceForm.markAllAsTouched();
    if (this.step === 'launch' && !this.leadCreated) this.leadForm.markAllAsTouched();
  }

  // ---------- step actions ----------
  saveOrganization(): void {
    if (this.orgForm.invalid) { this.orgForm.markAllAsTouched(); return; }
    this.saving = true;
    const request = this.orgForm.getRawValue();
    const call = this.organization ? this.api.updateOrganization(request) : this.api.createOrganization(request);
    call
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: org => {
          this.organization = org;
          this.orgMissing = false;
          this.completedSteps.add('organization');
          this.message = this.organization ? 'Organization saved.' : 'Organization created.';
          if (!this.completedSteps.has('organization') || this.currentStep === 0) this.currentStep++;
        },
        error: () => this.error = 'Could not create the organization. Check the slug and try again.'
      });
  }

  saveBusiness(): void {
    if (this.businessForm.invalid) { this.businessForm.markAllAsTouched(); return; }
    this.saving = true;
    const request: CreateClientBusinessRequest = this.businessForm.getRawValue();
    this.api.createClientBusiness(request)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: business => {
          this.businesses = [...this.businesses, business];
          this.selectedBusinessId = business.id;
          this.completedSteps.add('business');
          this.message = `Client business "${business.name}" created.`;
          this.currentStep++;
        },
        error: () => this.error = 'Could not create the client business. The slug may already be in use.'
      });
  }

  saveWorkspace(): void {
    if (this.workspaceForm.invalid || !this.selectedBusinessId) { this.workspaceForm.markAllAsTouched(); return; }
    this.saving = true;
    const request: CreateWorkspaceRequest = {
      ...this.workspaceForm.getRawValue(),
      clientBusinessIds: [this.selectedBusinessId]
    };
    this.api.createWorkspace(request)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: ws => {
          this.workspaces = [...this.workspaces, ws];
          this.selectedWorkspaceId = ws.id;
          this.completedSteps.add('workspace');
          this.message = `Workspace "${ws.name}" created.`;
          this.currentStep++;
        },
        error: () => this.error = 'Could not create the workspace. Try again.'
      });
  }

  loadConfiguration(): void {
    if (!this.selectedBusinessId) return;
    const cb = this.selectedBusinessId;
    this.api.getBusinessProfile(cb).pipe(catchError(() => of(null))).subscribe(p => {
      this.businessProfile = p ?? undefined;
      this.profileForm.setValue({
        description: p?.description ?? '', industry: p?.industry ?? '', category: p?.category ?? ''
      });
    });
    this.api.listOfferings(cb).pipe(catchError(() => of([]))).subscribe(o => this.offerings = o.map(x => ({ id: x.id, name: x.name, kind: x.kind })));
    this.api.listTargetIndustries(cb).pipe(catchError(() => of([]))).subscribe(i => this.industries = i);
    this.api.listIndustryPacks(cb).pipe(catchError(() => of([]))).subscribe(p => this.industryPacks = p);
  }

  saveProfile(): void {
    if (!this.selectedBusinessId) return;
    this.saving = true;
    this.api.updateBusinessProfile(this.selectedBusinessId, this.profileForm.getRawValue())
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => { this.message = 'Business profile saved.'; this.completedSteps.add('configure'); },
        error: () => this.error = 'Could not save the business profile.'
      });
  }

  addOffering(): void {
    if (this.offeringForm.invalid || !this.selectedBusinessId) return;
    const req: OfferingRequest = this.offeringForm.getRawValue();
    this.api.createOffering(this.selectedBusinessId, req).subscribe(() => {
      this.offeringForm.reset({ name: '', kind: 'Service', description: '' });
      this.loadConfiguration();
      this.message = 'Offering added.';
    });
  }

  addIndustry(): void {
    const industry = this.industryInput.trim();
    if (!industry || !this.selectedBusinessId) return;
    this.api.addTargetIndustry(this.selectedBusinessId, industry).subscribe(() => {
      this.industryInput = '';
      this.loadConfiguration();
    });
  }

  installPack(pack: IndustryPack): void {
    if (!this.selectedBusinessId || this.installingPack) return;
    this.installingPack = pack.key;
    this.api.installIndustryPack(this.selectedBusinessId, pack.key)
      .pipe(finalize(() => this.installingPack = ''))
      .subscribe({
        next: r => {
          this.message = `Installed "${pack.name}" — ${r.createdCount} items created.`;
          this.loadConfiguration();
        },
        error: () => this.error = 'Could not install the industry pack.'
      });
  }

  removeIndustry(id: string): void {
    if (!this.selectedBusinessId) return;
    this.api.removeTargetIndustry(this.selectedBusinessId, id).subscribe(() => this.loadConfiguration());
  }

  seedDemo(): void {
    if (!this.selectedBusinessId || this.seeding) return;
    this.seeding = true;
    this.error = '';
    this.api.seedDemoData(this.selectedBusinessId)
      .pipe(finalize(() => this.seeding = false))
      .subscribe({
        next: r => {
          this.seededCount = r.recordsCreated;
          this.message = r.recordsCreated > 0
            ? `Demo data loaded — ${r.recordsCreated} records created.`
            : 'Demo data already present — nothing new was needed.';
        },
        error: () => this.error = 'Could not seed demo data. You need Editor or ClientAdmin role on this business.'
      });
  }

  createFirstLead(): void {
    if (this.leadForm.invalid || !this.selectedBusinessId) { this.leadForm.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.leadForm.getRawValue();
    this.api.createLead(this.selectedBusinessId, {
      type: 'Organization', name: v.name, email: v.email || undefined,
      phone: v.phone || undefined, industry: v.industry || undefined,
      source: 'Manual', workspaceId: this.selectedWorkspaceId || undefined
    }).pipe(finalize(() => this.saving = false)).subscribe({
      next: () => { this.leadCreated = true; this.message = 'First lead created.'; },
      error: () => this.error = 'Could not create the lead.'
    });
  }
}
