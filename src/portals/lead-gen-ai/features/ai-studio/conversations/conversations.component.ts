import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Thread, Msg } from '../ai-studio.service';
import { PopupService, ASIDE_CLASS, ASIDE_SIZE, SharedService } from '@app-global';
import { ThreadPopupComponent } from '../popups/thread-popup.component';

@Component({
  selector: 'app-conversations',
  standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="conv">
    <div class="cols">
      <section class="card">
        <div class="hd"><h3>Threads</h3><button class="btn" (click)="openNew()">+ New</button></div>

        <div class="th" *ngFor="let t of threads" [class.on]="sel?.id===t.id" (click)="open(t)">
          <b>{{ t.subject }}</b><small>{{ t.channel }} · {{ t.status }}</small>
        </div>
        <p class="muted" *ngIf="!threads.length">No threads.</p>
      </section>
      <section class="card" *ngIf="sel">
        <div class="hd"><h3>{{ sel.subject }}</h3>
          <button class="btn" (click)="toggle()">{{ sel.status==='open'?'Close':'Reopen' }}</button></div>
        <div class="msgs">
          <div class="msg" *ngFor="let m of msgs" [class.ai]="m.isAi" [class.out]="m.direction==='outbound'">
            <small>{{ m.direction }}{{ m.isAi?' · AI':'' }} · {{ m.sentAt|date:'short' }}</small>{{ m.body }}
          </div>
        </div>
        <div class="composer">
          <input [(ngModel)]="draft" placeholder="Reply… (or leave empty for AI draft)" (keyup.enter)="send()"/>
          <button class="btn primary" (click)="send()">Send</button>
        </div>
      </section>
    </div>
  </div>`,
  styles: [`
    .conv{padding:16px;max-width:1100px;margin:0 auto}.cols{display:grid;grid-template-columns:340px 1fr;gap:14px;height:calc(100vh - 180px)}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px;display:flex;flex-direction:column;overflow:hidden}
    .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}h3{margin:0;font-size:14px}
    .btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}
    .new{display:flex;flex-direction:column;gap:6px;margin-bottom:8px}.new input{padding:7px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit}
    .th{padding:8px;border-bottom:1px solid var(--border,#f0f0f0);cursor:pointer;border-radius:6px}.th.on{background:#f0f6ff}.th small{display:block;color:var(--muted,#888)}
    .msgs{flex:1;overflow:auto;display:flex;flex-direction:column;gap:8px;margin-bottom:8px}
    .msg{background:#f4f6f9;border-radius:8px;padding:8px 10px;font-size:13px;max-width:80%}.msg.out{align-self:flex-end;background:#e3edff}.msg.ai{border-left:3px solid #3467d6}
    .msg small{display:block;color:var(--muted,#888);font-size:11px}
    .composer{display:flex;gap:8px}.composer input{flex:1;padding:8px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit}
    .muted{color:var(--muted,#888);font-size:12px}
  `]
})
export class ConversationsComponent implements OnInit {
  studio = inject(AiStudioService);
  popup = inject(PopupService); shared = inject(SharedService);
  threads: Thread[] = []; msgs: Msg[] = []; sel?: Thread;
  showNew = false; nChannel = 'email'; nSubject = ''; draft = '';
  ngOnInit() { this.load(); }
  load() { this.studio.listThreads().subscribe(p => this.threads = p.items); }
  open(t: Thread) { this.sel = t; this.studio.listMessages(t.id).subscribe(p => this.msgs = [...p.items].reverse()); }
  openNew() {
    const popup = { header: { text: 'New thread' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(ThreadPopupComponent, popup, { id: null, data: {}, actionType: 'Show' })
      .then(() => this.load()).catch(() => this.load());
  }
  send() {
    if (!this.sel) return;
    const isAi = !this.draft.trim();
    const body = this.draft.trim() || `[AI draft] Following up on "${this.sel.subject}" — checking in on next steps.`;
    this.studio.postMessage(this.sel.id, isAi ? 'outbound' : 'outbound', body, isAi).subscribe(m => {
      this.msgs.push(m); this.draft = '';
    });
  }
  toggle() { if (!this.sel) return; (this.sel.status === 'open' ? this.studio.closeThread(this.sel.id) : this.studio.reopenThread(this.sel.id)).subscribe(() => this.load()); }
}
