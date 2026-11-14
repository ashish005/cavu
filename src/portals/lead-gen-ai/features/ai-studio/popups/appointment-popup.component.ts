import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService } from '../ai-studio.service';
@Component({selector:'app-appointment-popup',standalone:true,imports:[CommonModule,FormsModule],
  template:`<div class="ce"><h3>Book appointment</h3>
    <div class="f"><label>Date & time *</label><input type="datetime-local" [(ngModel)]="when"/></div>
    <div class="row">
      <div class="f"><label>Duration (min)</label><input type="number" [(ngModel)]="dur" min="5" max="480"/></div>
      <div class="f"><label>Type</label><select [(ngModel)]="type"><option>Discovery call</option><option>Demo</option><option>Consultation</option><option>Follow-up</option><option>Interview</option></select></div>
    </div>
    <div class="f"><label>Notes</label><textarea [(ngModel)]="notes" rows="2"></textarea></div>
    <small class="err" *ngIf="err">{{err}}</small>
    <div class="foot"><button class="btn" (click)="cancel()">Cancel</button><button class="btn primary" [disabled]="busy" (click)="save()">Book</button></div></div>`,
  styles: [`.ce{padding:16px;min-width:360px}h3{margin:0 0 14px;font-size:16px}.f{margin-bottom:12px}.f label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}input,select,textarea{width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid var(--border,#ddd);background:var(--bg,#fff);color:inherit;font-size:13px}.err{color:#c0392b}.foot{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.btn{padding:8px 16px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}.btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn:danger{color:#c0392b}`]
})
export class AppointmentPopupComponent {
  studio = inject(AiStudioService);
  when='';dur=30;type='Discovery call';notes='';
  async save(){ if(!this.when){this.err='Date/time required';return;} this.busy=true;this.err='';
    try{ this.onOk.emit(await this.studio.createAppointment(undefined,new Date(this.when).toISOString(),this.dur||30,[this.type,this.notes].filter(Boolean).join(' — ')||undefined).toPromise()); }
    catch(e:any){this.err=e?.message||'Failed';}finally{this.busy=false;} }
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  err = ''; busy = false;
  cancel() { this.onCancel.emit(null); }
}
