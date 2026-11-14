import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService } from '../ai-studio.service';
@Component({selector:'app-campaign-popup',standalone:true,imports:[CommonModule,FormsModule],
  template:`<div class="ce"><h3>New campaign</h3>
    <div class="f"><label>Name *</label><input [(ngModel)]="name"/></div>
    <div class="row">
      <div class="f"><label>Channel *</label><select [(ngModel)]="channel"><option>email</option><option>sms</option><option>voice</option><option>social</option></select></div>
      <div class="f"><label>Send time</label><input [(ngModel)]="sendTime" placeholder="09:00"/></div>
    </div>
    <div class="f"><label>Audience notes</label><textarea [(ngModel)]="notes" rows="2"></textarea></div>
    <small class="err" *ngIf="err">{{err}}</small>
    <div class="foot"><button class="btn" (click)="cancel()">Cancel</button><button class="btn primary" [disabled]="busy" (click)="save()">Create campaign</button></div></div>`,
  styles: [`.ce{padding:16px;min-width:360px}h3{margin:0 0 14px;font-size:16px}.f{margin-bottom:12px}.f label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}input,select,textarea{width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid var(--border,#ddd);background:var(--bg,#fff);color:inherit;font-size:13px}.err{color:#c0392b}.foot{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.btn{padding:8px 16px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}.btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn:danger{color:#c0392b}`]
})
export class CampaignPopupComponent {
  studio = inject(AiStudioService);
  name='';channel='email';sendTime='09:00';notes='';
  async save(){ if(!this.name.trim()){this.err='Name required';return;} this.busy=true;this.err='';
    try{ this.onOk.emit(await this.studio.createCampaign(this.name.trim(),this.channel,this.sendTime?JSON.stringify({sendTime:this.sendTime}):undefined).toPromise()); }
    catch(e:any){this.err=e?.message||'Failed';}finally{this.busy=false;} }
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  err = ''; busy = false;
  cancel() { this.onCancel.emit(null); }
}
