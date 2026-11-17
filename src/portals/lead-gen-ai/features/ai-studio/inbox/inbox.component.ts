import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiStudioService, Thread, Msg } from '../ai-studio.service';
import { TableComponent, PaginationComponent } from '@app-global';
import { StudioSelectCellComponent, StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

type Tab = 'conversations' | 'voice';

/** Route 5 — Inbox & Voice: unified conversations + voice ops audit. */
@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, PaginationComponent],
  template: `
  <div>
    <div class="page-head">
      <div><h1>Inbox &amp; Voice</h1><p class="sub">Omnichannel conversations + AI voice audit</p></div>
      <div class="tabs">
        <button class="chip" [class.on]="tab==='conversations'" (click)="tab='conversations'">Conversations</button>
        <button class="chip" [class.on]="tab==='voice'" (click)="tab='voice'">Voice Operations</button>
      </div>
    </div>

    <!-- 5A conversations -->
    <div class="cols conv" *ngIf="tab==='conversations'">
      <section class="card">
        <div class="hd"><h3>Threads</h3><button class="btn" (click)="openNew()">+ New</button></div>
        <div class="filters"><button class="chip" [class.on]="tFilter==='all'" (click)="tFilter='all'">All</button>
          <button class="chip" [class.on]="tFilter==='handoff'" (click)="tFilter='handoff'">Needs handoff</button>
          <button class="chip" [class.on]="tFilter==='ai'" (click)="tFilter='ai'">AI autonomous</button></div>
        <div class="thread-list">
          <div class="t-item" *ngFor="let t of filteredThreads" [class.sel]="sel===t" (click)="open(t)">
            <div class="t-top"><b>{{ t.subject }}</b><span class="badge" [class.warn]="t.status!=='open'" [class.ok]="t.status==='open'">{{ t.status }}</span></div>
            <small class="muted">{{ t.channel }} · {{ entityName(t.entityId) }}</small>
          </div>
          <p class="muted" *ngIf="!filteredThreads.length">No threads.</p>
        </div>
      </section>
      <section class="card" *ngIf="sel">
        <div class="hd"><h3>{{ sel.subject }}</h3>
          <button class="btn" (click)="toggle()">{{ sel.status==='open' ? 'Take over (human)' : 'Return to AI' }}</button></div>
        <div class="msgs">
          <div class="msg" *ngFor="let m of messages" [class.in]="m.direction==='inbound'" [class.out]="m.direction!=='inbound'">
            <small class="muted">{{ m.isAi ? 'AI Agent' : (m.direction==='inbound'?'Contact':'Human') }} · {{ m.sentAt | date:'h:mm a' }}</small><br/>{{ m.body }}
          </div>
        </div>
        <div class="composer"><input [(ngModel)]="reply" placeholder="Reply as human operator…" (keyup.enter)="send()"/><button class="btn primary" (click)="send()">Send</button></div>
      </section>
      <section class="card" *ngIf="!sel"><p class="muted">Select a thread.</p></section>
    </div>

    <!-- 5B voice ops -->
    <div class="cols" *ngIf="tab==='voice'">
      <section class="card">
        <h3>SIP call telemetry</h3>
        <org-grid [data]="calls" [options]="callsGrid" [isLoading]="callsLoading"></org-grid>
        <org-grid-pagination [page]="callsPage" [count]="callsTotal" [perPage]="callsPageSize" [loading]="callsLoading" (cb)="onCallsPage($event)"></org-grid-pagination>
        <p class="muted" *ngIf="!calls.length">No calls recorded.</p>
      </section>
      <section class="card" *ngIf="selCall">
        <div class="hd"><h3>{{ selCall.contactName }}</h3><button class="btn" (click)="followUp(selCall)">Open follow-up thread</button></div>
        <div class="comp-strip">
          <span class="badge" [class.ok]="selCall.compliance?.dncCleared">DNC Registry Cleared</span>
          <span class="badge" [class.ok]="selCall.compliance?.recordingDisclosure">Recording Disclosure Verified</span>
        </div>
        <div class="msgs">
          <div class="msg" *ngFor="let t of selCall.transcript" [class.in]="t.who==='Contact'" [class.out]="t.who!=='Contact'">
            <small class="muted">{{ t.who }} · {{ t.t }}s</small><br/>{{ t.text }}
          </div>
        </div>
      </section>
      <section class="card" *ngIf="!selCall"><p class="muted">Select a call.</p></section>
    </div>
  </div>`,
  styles: [`
    .tabs{display:flex;gap:6px}.conv{grid-template-columns:340px 1fr;height:auto}
    .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .filters{display:flex;gap:6px;margin-bottom:8px}
    .thread-list{max-height:380px;overflow:auto}
    .t-item{padding:10px;border:1px solid var(--st-border,#e6e9f2);border-radius:10px;margin-bottom:8px;cursor:pointer}
    .t-item.sel{border-color:#3467d6;background:#eef3ff}
    .t-top{display:flex;justify-content:space-between;align-items:center}
    .msgs{max-height:340px;overflow:auto;margin-bottom:10px}
    .msg{padding:9px 12px;border-radius:10px;margin-bottom:8px;font-size:13px;max-width:85%}
    .msg.in{background:#eef4ff}.msg.out{background:#f0f7f1}
    .composer{display:flex;gap:8px}.composer input{flex:1}
    .call{padding:10px;border:1px solid var(--st-border,#e6e9f2);border-radius:10px;margin-bottom:8px;cursor:pointer}
    .call.sel{border-color:#3467d6;background:#eef3ff}
    .comp-strip{display:flex;gap:8px;margin-bottom:12px}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:8px;border-bottom:1px solid var(--st-border,#e6e9f2);text-align:left}
  `]
})
export class InboxComponent implements OnInit {
  studio = inject(AiStudioService); router = inject(Router);
  tab: Tab = 'conversations';
  threads: Thread[] = []; messages: Msg[] = []; sel?: Thread; reply = ''; tFilter = 'all';
  calls: any[] = []; selCall?: any;
  callsPage = 1; callsPageSize = 25; callsTotal = 0; callsLoading = false;
  callsGrid: any = {
    header: { title: 'SIP call telemetry', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'contactName', headerName: 'Contact' },
      { field: 'disposition', headerName: 'Disposition', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v?.includes('Qualified') ? 'ok' : v?.includes('Callback') ? 'warn' : v?.includes('Escalation') ? 'danger' : '' },
      { field: 'direction', headerName: 'Direction' },
      { field: 'agentName', headerName: 'Agent' },
      { field: 'durationSec', headerName: 'Duration', cellFn: (c: any) => c.durationSec + 's' },
      { field: 'startedAt', headerName: 'Started', cellFn: (c: any) => new Date(c.startedAt).toLocaleString() },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [{ label: 'View', run: (c: any) => this.selCall = c }] },
    ],
  };

  get filteredThreads() {
    if (this.tFilter === 'ai') return this.threads.filter(t => t.status === 'open');
    if (this.tFilter === 'handoff') return this.threads.filter(t => t.status !== 'open');
    return this.threads;
  }
  ngOnInit() {
    this.load(); this.loadCalls();
  }
  loadCalls() {
    this.callsLoading = true;
    this.studio.listVoiceCalls(this.callsPage, this.callsPageSize).subscribe({
      next: p => { this.calls = p.items; this.callsTotal = p.totalCount; this.callsLoading = false; },
      error: () => this.callsLoading = false,
    });
  }
  onCallsPage(e: { skip: number; take: number }) {
    this.callsPageSize = e.take; this.callsPage = Math.floor(e.skip / e.take) + 1; this.loadCalls();
  }
  load() { this.studio.listThreads().subscribe(p => { this.threads = p.items;
      if (this.studio.pendingThreadId) { const t = this.threads.find(x => x.id === this.studio.pendingThreadId); this.studio.pendingThreadId = undefined; if (t) { this.tab='conversations'; this.open(t); } }
    }); }
  entityName(id?: string) { return this.studio.entities$.value.find(e => e.id === id)?.name ?? ''; }
  openNew() { /* reuse thread popup via popup service omitted here — navigate uses existing flow */ }
  open(t: Thread) { this.sel = t; this.studio.listMessages(t.id).subscribe(p => this.messages = p.items); }
  toggle() { if (!this.sel) return; (this.sel.status === 'open' ? this.studio.closeThread(this.sel.id) : this.studio.reopenThread(this.sel.id)).subscribe(() => { this.load(); if (this.sel) this.open(this.sel); }); }
  send() { if (!this.sel || !this.reply.trim()) return; this.studio.postMessage(this.sel.id, 'outbound', this.reply.trim(), false).subscribe(() => { this.reply = ''; this.open(this.sel!); }); }
  dial() { const contact = prompt('Contact number/name:'); if (contact) this.studio.placeVoiceCall(undefined, contact).subscribe(r => { if (r.live) alert('Live call placed via ' + r.provider); this.loadCalls(); }); }
  followUp(c: any) { this.studio.voiceFollowUp(c.id).subscribe(r => { this.tab = 'conversations'; this.load(); setTimeout(() => { const t = this.threads.find(x => x.id === r.threadId); if (t) this.open(t); }, 500); }); }
}
