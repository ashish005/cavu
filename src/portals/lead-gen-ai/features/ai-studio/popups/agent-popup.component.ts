import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService } from '../ai-studio.service';
@Component({selector:'app-agent-popup',standalone:true,imports:[CommonModule,FormsModule],
  template:`<div class="ce"><h3>New AI agent</h3>
    <div class="f"><label>Name *</label><input [(ngModel)]="name"/></div>
    <div class="f"><label>Purpose *</label><textarea [(ngModel)]="purpose" rows="2"></textarea></div>
    <div class="f"><label>Behaviour (JSON)</label><textarea [(ngModel)]="config" rows="3" placeholder='{"model":"gpt-4o-mini"}'></textarea></div>
    <small class="err" *ngIf="err">{{err}}</small>
    <div class="foot"><button class="btn" (click)="cancel()">Cancel</button><button class="btn primary" [disabled]="busy" (click)="save()">Create agent</button></div></div>`,
  styles: [`.ce{padding:16px;min-width:360px}h3{margin:0 0 14px;font-size:16px}.f{margin-bottom:12px}.f label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}input,select,textarea{width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid var(--border,#ddd);background:var(--bg,#fff);color:inherit;font-size:13px}.err{color:#c0392b}.foot{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.btn{padding:8px 16px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}.btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn:danger{color:#c0392b}`]
})
export class AgentPopupComponent {
  studio = inject(AiStudioService);
  name='';purpose='';config='{"model":"gpt-4o-mini"}';
  async save(){ if(!this.name.trim()||!this.purpose.trim()){this.err='Name and purpose required';return;} this.busy=true;this.err='';
    try{ this.onOk.emit(await this.studio.createAgent(this.name.trim(),this.purpose.trim(),this.config||'{}').toPromise()); }
    catch(e:any){this.err=e?.message||'Failed';}finally{this.busy=false;} }
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  err = ''; busy = false;
  cancel() { this.onCancel.emit(null); }
}
