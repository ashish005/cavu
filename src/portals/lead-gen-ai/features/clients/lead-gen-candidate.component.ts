import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenOutcomePopupComponent } from '../shared/popups/entity/outcome-popup.component';
import { LeadGenCandidateResumePopupComponent } from '../shared/popups/entity/candidate-resume-popup.component';
import { LeadGenCandidateAlertPopupComponent } from '../shared/popups/entity/candidate-alert-popup.component';
import { LeadGenCandidateJobPopupComponent } from '../shared/popups/entity/candidate-job-popup.component';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import {
  LeadGenApiService,
  JobListing,
  JobMatchAssessment,
  JobAlert,
  JobApplication,
  Resume,
  CandidateProfile,
  CandidatePreferences,
  JobSource
} from '../../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-candidate',
  templateUrl: './lead-gen-candidate.component.html',
  styleUrls: ['./lead-gen-candidate.component.scss'],
  standalone: false
})
export class LeadGenCandidateComponent implements OnInit {
  readonly perms = inject(LeadGenPermissionsService);
  tab: 'jobs' | 'alerts' | 'applications' | 'resumes' = 'jobs';
  error = '';
  message = '';
  loading = false;

  jobs: JobListing[] = [];
  matches: Record<string, JobMatchAssessment[]> = {};
  alerts: JobAlert[] = [];
  applications: JobApplication[] = [];
  resumes: Resume[] = [];
  selectedJob?: JobListing;
  selectedApplication?: JobApplication;

  jobGridOptions: any = { header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false }, total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [{headerName:'Title',field:'title'},{headerName:'Company',field:'company'},{headerName:'Location',field:'location'},{headerName:'Status',field:'status'}] };
  appGridOptions: any = { header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false }, total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [{headerName:'Job',field:'job'},{headerName:'Stage',field:'stage'},{headerName:'Applied',field:'applied'},{headerName:'Outcome',field:'outcome'}] };
  resumeGridOptions: any = { header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false }, total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [{headerName:'File',field:'fileName'},{headerName:'Status',field:'status'},{headerName:'Added',field:'added'}] };

  get jobRows(): any[] { return this.jobs.map(j => ({...j, company: j.company||'—', location: j.location||'—', status: j.status + (j.isSaved?' · saved':'')})); }
  get applicationRows(): any[] { return this.applications.map(a => ({...a, job: a.jobListingId.slice(0,8)+'…', applied: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—', outcome: a.outcome||'—'})); }
  get resumeRows(): any[] { return this.resumes.map(r => ({...r, added: new Date(r.createdAt).toLocaleDateString()})); }
  selectJobRow(r:any){ this.selectedJob = this.jobs.find(j=>j.id===r.id); }
  selectApplicationRow(r:any){ this.selectedApplication = this.applications.find(a=>a.id===r.id); }
  jobSources: JobSource[] = [];
  profile?: CandidateProfile;
  prefs?: CandidatePreferences;
  jobSearch = '';
  savedOnly = false;
  newJobTitle = '';
  newJobCompany = '';
  newJobLocation = '';
  newAlertName = '';
  newAlertCriteria = '';
  newResumeName = '';
  newResumeRef = '';

  constructor(private readonly api: LeadGenApiService, private readonly popupService: PopupService) {}

  ngOnInit(): void {
    this.api.getCandidateProfile().subscribe({ next: (p) => this.profile = p, error: (e) => { if (e.status !== 404) this.error = this.err(e); } });
    this.api.getCandidatePreferences().subscribe({ next: (p) => this.prefs = p, error: () => undefined });
    this.loadJobs();
    this.loadAlerts();
    this.loadApplications();
    this.loadResumes();
    this.api.listJobSources().subscribe({ next: (s) => this.jobSources = s, error: () => undefined });
  }

  get tabs() { return [{ key: 'jobs' as const, label: 'Jobs' }, { key: 'alerts' as const, label: 'Alerts' }, { key: 'applications' as const, label: 'Applications' }, { key: 'resumes' as const, label: 'Resumes' }]; }
  setTab(t: typeof this.tab) { this.tab = t; }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }

  loadJobs(): void {
    this.loading = true;
    this.api.searchJobs(this.jobSearch || undefined, this.savedOnly || undefined).pipe().subscribe({
      next: (jobs) => { this.jobs = jobs; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
  }

  loadAlerts(): void { this.api.listJobAlerts().subscribe({ next: (a) => this.alerts = a, error: () => undefined }); }
  loadApplications(): void { this.api.listApplications().subscribe({ next: (a) => this.applications = a, error: () => undefined }); }
  loadResumes(): void { this.api.listResumes().subscribe({ next: (r) => this.resumes = r, error: () => undefined }); }

  toggleSave(job: JobListing): void {
    this.api.saveJob(job.id).subscribe({
      next: (updated) => this.jobs = this.jobs.map(j => j.id === updated.id ? updated : j),
      error: (e) => this.error = this.err(e)
    });
  }

  assessMatch(job: JobListing): void {
    this.api.assessJobMatch(job.id).subscribe({
      next: (m) => {
        this.matches[job.id] = [m, ...(this.matches[job.id] ?? [])];
        this.message = `Match assessment: ${m.assessment}.`;
      },
      error: (e) => this.error = this.err(e)
    });
  }

  addJob(): void {
    const parameters = { actionType: 'Show',  };
    this.popupService.showCustomPopup(LeadGenCandidateJobPopupComponent, { header: { text: 'Add job' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy();  });
  }


  addAlert(): void {
    const parameters = { actionType: 'Show',  };
    this.popupService.showCustomPopup(LeadGenCandidateAlertPopupComponent, { header: { text: 'Create alert' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy();  });
  }


  pauseAlert(alert: JobAlert): void {
    this.api.setJobAlertStatus(alert.id, alert.status === 'Active' ? 'Paused' : 'Active').subscribe({
      next: (updated) => this.alerts = this.alerts.map(a => a.id === updated.id ? updated : a),
      error: (e) => this.error = this.err(e)
    });
  }

  applyToJob(job: JobListing): void {
    this.api.createApplication({ jobListingId: job.id, isExternal: false }).subscribe({
      next: () => { this.message = 'Application tracked.'; this.loadApplications(); },
      error: (e) => this.error = this.err(e)
    });
  }

  advanceApplication(app: JobApplication, stage: string): void {
    this.api.advanceApplication(app.id, stage).subscribe({
      next: (updated) => this.applications = this.applications.map(a => a.id === updated.id ? updated : a),
      error: (e) => this.error = this.err(e)
    });
  }

  recordOutcome(app: JobApplication): void {
    const parameters = { actionType: 'Show', applicationId: app.id };
    this.popupService.showCustomPopup(LeadGenOutcomePopupComponent, { header: { text: 'Outcome' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy();  });
  }


  addResume(): void {
    const parameters = { actionType: 'Show',  };
    this.popupService.showCustomPopup(LeadGenCandidateResumePopupComponent, { header: { text: 'Upload resume' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy();  });
  }


  pages: Record<string, number> = {};
  pageSize = 10;
  pagedRows(rows: any[], key: string): any[] {
    const p = this.pages[key] || 1;
    return rows.slice((p - 1) * this.pageSize, p * this.pageSize);
  }
  onPage(key: string, e: any): void {
    this.pages[key] = Math.floor(e.skip / e.take) + 1;
  }
}
