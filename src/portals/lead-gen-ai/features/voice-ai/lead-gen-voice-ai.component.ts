import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, VoiceProviderConfig, VoiceInteraction
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenVoiceSummaryPopupComponent } from '../shared/popups/entity/voice-summary-popup.component';
import { LeadGenVoiceCallPopupComponent } from '../shared/popups/entity/voice-call-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-gen-voice-ai',
  templateUrl: './lead-gen-voice-ai.component.html',
  styleUrls: ['./lead-gen-voice-ai.component.scss'],
  standalone: false
})
export class LeadGenVoiceAiComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly perms = inject(LeadGenPermissionsService);
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  provider?: VoiceProviderConfig;
  interactions: VoiceInteraction[] = [];
  loading = false;
  saving = false;
  error = '';
  message = '';
  statusFilter = '';
  selectedCall?: VoiceInteraction;

  callGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Direction', field: 'direction' }, { headerName: 'Party', field: 'party' },
      { headerName: 'Status', field: 'statusLabel' }, { headerName: 'Summary', field: 'summary' },
      { headerName: 'Started', field: 'started' }
    ]
  };

  get callRows(): any[] {
    return this.interactions.map(v => ({
      ...v, party: v.remoteParty || '—',
      statusLabel: v.escalatedToUserId ? 'Escalated' : v.status,
      summary: v.transcriptSummary || '—',
      started: new Date(v.startedAt).toLocaleString()
    }));
  }
  selectCallRow(row: any): void { this.selectedCall = this.interactions.find(v => v.id === row.id); }

  providerForm = { providerName: '', credentialReference: '', settingsJson: '{}', isEnabled: true };

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  get stats() {
    const total = this.interactions.length;
    const inbound = this.interactions.filter(i => i.direction === 'Inbound').length;
    const escalated = this.interactions.filter(i => i.escalatedToUserId).length;
    const failed = this.interactions.filter(i => i.status === 'Failed').length;
    return { total, inbound, outbound: total - inbound, escalated, failed };
  }

  ngOnInit(): void {
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.workspaceContext.context$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
      const id = c?.clientBusinessId ?? '';
      if (id && id !== this.clientBusinessId) { this.clientBusinessId = id; this.load(); }
    });
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length) this.clientBusinessId = bs[0].id;
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  onBusinessChange(id: string): void { this.clientBusinessId = id; this.load(); }

  load(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.loading = true;
    this.error = '';
    this.api.getVoiceProvider(cb).subscribe({
      next: (p) => {
        this.provider = p;
        this.providerForm = {
          providerName: p.providerName, credentialReference: p.credentialReference ?? '',
          settingsJson: p.settingsJson ?? '{}', isEnabled: p.isEnabled
        };
      },
      error: (e) => { if (e.status !== 404) this.error = this.err(e); }
    });
    this.api.listVoiceInteractions(cb, this.statusFilter || undefined).subscribe({
      next: (v) => { this.interactions = v; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
  }

  saveProvider(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.saving = true;
    this.api.setVoiceProvider(cb, {
      providerName: this.providerForm.providerName.trim() || 'default',
      credentialReference: this.providerForm.credentialReference || undefined,
      settingsJson: this.providerForm.settingsJson || '{}',
      isEnabled: this.providerForm.isEnabled
    }).subscribe({
      next: (p) => { this.provider = p; this.saving = false; this.message = 'Voice provider saved.'; },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = this.err(e); }
    });
  }

  openPopup(fields: EntityFormField[], submitLabel: string, run: (v: Record<string, string>) => Observable<unknown>, onDone?: () => void): void {
    const parameters = {
      actionType: 'Show',
      fields, submitLabel,
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        run(values).subscribe({
          next: () => { this.popupService.destroy(); onDone?.(); resolve(); },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { header: { text: 'Form' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }

  logCall(): void {
    if (!this.clientBusinessId) return;
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId };
    this.popupService.showCustomPopup(LeadGenVoiceCallPopupComponent, { header: { text: 'Log call' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }

  addSummary(v: VoiceInteraction): void {
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId, interactionId: v.id };
    this.popupService.showCustomPopup(LeadGenVoiceSummaryPopupComponent, { header: { text: 'Call summary' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }


  escalate(v: VoiceInteraction): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.escalateVoiceInteraction(cb, v.id).subscribe({
      next: () => { this.message = 'Escalated to human agent.'; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
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
