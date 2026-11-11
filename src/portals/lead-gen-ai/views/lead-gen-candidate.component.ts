import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
} from '../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-candidate',
  templateUrl: './lead-gen-candidate.component.html',
  styleUrls: ['./lead-gen-candidate.component.scss'],
  standalone: false
})
export class LeadGenCandidateComponent implements OnInit {
  tab: 'jobs' | 'alerts' | 'applications' | 'resumes' = 'jobs';
  error = '';
  message = '';
  loading = false;

  jobs: JobListing[] = [];
  matches: Record<string, JobMatchAssessment[]> = {};
  alerts: JobAlert[] = [];
  applications: JobApplication[] = [];
  resumes: Resume[] = [];
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

  constructor(private readonly api: LeadGenApiService) {}

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
    if (!this.newJobTitle.trim()) return;
    this.api.createJobListing({ title: this.newJobTitle, company: this.newJobCompany || undefined, location: this.newJobLocation || undefined }).subscribe({
      next: (j) => { this.jobs = [j, ...this.jobs]; this.newJobTitle = ''; this.newJobCompany = ''; this.newJobLocation = ''; this.message = 'Job added.'; },
      error: (e) => this.error = this.err(e)
    });
  }

  addAlert(): void {
    if (!this.newAlertName.trim() || !this.newAlertCriteria.trim()) return;
    this.api.createJobAlert({ name: this.newAlertName, criteriaJson: this.newAlertCriteria, frequency: 'Daily' }).subscribe({
      next: (a) => { this.alerts = [...this.alerts, a]; this.newAlertName = ''; this.newAlertCriteria = ''; this.message = 'Alert created.'; },
      error: (e) => this.error = this.err(e)
    });
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
    const outcome = window.prompt('Outcome (e.g. Rejected, Offer, Withdrawn):');
    if (!outcome) return;
    this.api.recordApplicationOutcome(app.id, outcome).subscribe({
      next: (updated) => this.applications = this.applications.map(a => a.id === updated.id ? updated : a),
      error: (e) => this.error = this.err(e)
    });
  }

  addResume(): void {
    if (!this.newResumeName.trim() || !this.newResumeRef.trim()) return;
    this.api.createResume({ fileName: this.newResumeName, storageReference: this.newResumeRef }).subscribe({
      next: (r) => { this.resumes = [...this.resumes, r]; this.newResumeName = ''; this.newResumeRef = ''; this.message = 'Resume uploaded.'; },
      error: (e) => this.error = this.err(e)
    });
  }
}
