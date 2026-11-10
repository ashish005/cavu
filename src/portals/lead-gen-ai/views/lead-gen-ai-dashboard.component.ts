import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '@app-environments';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import {
  LeadGenApiService,
  PossibleDuplicateProspect,
  Prospect,
  ProspectDuplicateConflict,
  ProspectType
} from '../services/lead-gen-api.service';

type ConnectionState = 'checking' | 'connected' | 'unavailable';

@Component({
  selector: 'lead-gen-ai-dashboard',
  templateUrl: './lead-gen-ai-dashboard.component.html',
  styleUrls: ['./lead-gen-ai-dashboard.component.scss'],
  standalone: false
})
export class LeadGenAiDashboardComponent implements OnInit {
  connectionState: ConnectionState = 'checking';
  lastChecked?: Date;
  prospects: Prospect[] = [];
  totalProspects = 0;
  isLoadingProspects = false;
  isSavingProspect = false;
  prospectsError = '';
  saveError = '';
  successMessage = '';
  duplicateMatches: PossibleDuplicateProspect[] = [];
  duplicateWarning = '';
  readonly openApiUrl: string;
  readonly showOpenApi = !environment.production;
  readonly prospectForm = this.formBuilder.group({
    type: this.formBuilder.nonNullable.control<ProspectType>('B2B'),
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.maxLength(200)]),
    email: this.formBuilder.control('', [Validators.email, Validators.maxLength(320)]),
    phone: this.formBuilder.control('', Validators.maxLength(50)),
    website: this.formBuilder.control('', Validators.maxLength(500)),
    industry: this.formBuilder.control('', Validators.maxLength(120))
  });

  constructor(
    private readonly api: LeadGenApiService,
    private readonly formBuilder: FormBuilder,
    destroyRef: DestroyRef
  ) {
    this.openApiUrl = this.api.getOpenApiUrl();
    this.prospectForm.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
      this.duplicateMatches = [];
      this.duplicateWarning = '';
    });
  }

  ngOnInit(): void {
    this.refreshConnection();
    this.loadProspects();
  }

  refreshConnection(): void {
    this.connectionState = 'checking';
    this.api.checkReadiness().subscribe({
      next: (status) => {
        this.connectionState = status.trim().toLowerCase() === 'healthy' ? 'connected' : 'unavailable';
        this.lastChecked = new Date();
      },
      error: () => {
        this.connectionState = 'unavailable';
        this.lastChecked = new Date();
      }
    });
  }

  loadProspects(): void {
    this.isLoadingProspects = true;
    this.prospectsError = '';
    this.api.listProspects().pipe(finalize(() => this.isLoadingProspects = false)).subscribe({
      next: (result) => {
        this.prospects = result.items;
        this.totalProspects = result.totalCount;
      },
      error: (error) => {
        this.prospectsError = this.getRequestError(error);
      }
    });
  }

  onProspectTypeChange(): void {
    if (this.prospectForm.controls.type.value === 'B2C') {
      this.prospectForm.patchValue({ website: '', industry: '' });
    }
  }

  createProspect(confirmPossibleDuplicates = false): void {
    if (this.prospectForm.invalid || this.isSavingProspect) {
      this.prospectForm.markAllAsTouched();
      return;
    }

    const request = this.prospectForm.getRawValue();
    this.isSavingProspect = true;
    this.saveError = '';
    this.successMessage = '';
    this.duplicateWarning = '';
    this.api.createProspect({
      type: request.type,
      name: request.name.trim(),
      email: request.email?.trim() || undefined,
      phone: request.phone?.trim() || undefined,
      website: request.website?.trim() || undefined,
      industry: request.industry?.trim() || undefined,
      confirmPossibleDuplicates
    }).pipe(finalize(() => this.isSavingProspect = false)).subscribe({
      next: () => {
        this.prospectForm.reset({ type: 'B2B', name: '', email: '', phone: '', website: '', industry: '' });
        this.duplicateMatches = [];
        this.successMessage = 'Prospect added to this branch.';
        this.loadProspects();
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 409 && this.isDuplicateConflict(error.error)) {
          this.duplicateMatches = error.error.matches;
          this.duplicateWarning = error.error.message;
          return;
        }
        this.saveError = this.getRequestError(error);
      }
    });
  }

  private isDuplicateConflict(value: unknown): value is ProspectDuplicateConflict {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const response = value as { message?: unknown; matches?: unknown };
    return typeof response.message === 'string' && Array.isArray(response.matches);
  }

  private getRequestError(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Your session is not authenticated. Sign in and try again.';
    }
    if (error.status === 403) {
      const detail = error.error?.detail;
      if (typeof detail === 'string') {
        return detail;
      }
      return 'Your token is missing a valid organization, branch, or user ID claim.';
    }
    if (error.status === 0) {
      return 'The Lead Gen API is unavailable. Check the API connection and try again.';
    }
    if (error.status === 400 && typeof error.error === 'object' && error.error !== null) {
      const body = error.error as { errors?: Record<string, string[]> };
      const messages = Object.values(body.errors ?? {}).flat();
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }
    return 'The request could not be completed. Review the fields and try again.';
  }
}