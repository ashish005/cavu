import {Component, OnInit, Input, OnDestroy, ViewChild, Injector, Directive, Injectable} from '@angular/core';
import {pairwise, startWith, Subscription} from "rxjs";
import {OrgResourceService, CoreQueryOptions, ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

class OrgTaskCalendarQueryOptions extends CoreQueryOptions {
    orgTaskId: any;
    orgUserId: string;
    constructor(model: any = {}){ super(model); }
   override toQueryString (){
        const obj = {
            orgTaskId: this.orgTaskId,
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}
class OrgTaskCalendar {
    id: number;
    orgTaskId: number;
    name: string;
    remark: string;
    inchargeId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    inchargeName: string;
    taskName: string;

    constructor(model: any = <any>{}) {
        const { id, orgTaskId, name, remark, inchargeId, startDate, startTime, endDate, endTime, inchargeName, taskName } = model;
        this.id = id;
        this.orgTaskId = orgTaskId;
        this.name = name;
        this.remark = remark;
        this.inchargeId = inchargeId;
        this.startDate = startDate;
        this.startTime = startTime || '09:00';
        this.endDate = endDate;
        this.endTime = endTime || '21:00';
        this.inchargeName = inchargeName;
        this.taskName = taskName;
    }
}

export class OrgTaskCalendarSerializer {
    fromJson(json: any): OrgTaskCalendar { return new OrgTaskCalendar(json); }
    toJson(data: any): any { return data; }
}

@Injectable()
class OrgTaskCalendarService extends OrgResourceService<OrgTaskCalendar>{
    constructor(public override injector: Injector) { super(injector, 'taskCalendar', new OrgTaskCalendarSerializer()); }
}
@Component({
    standalone: false,
    templateUrl: './templates/task-calendar.html',
    styles: [`:host{ display: contents; }`],
    providers: [OrgTaskCalendarService]
})
export class TaskCalendarComponent implements OnInit, OnDestroy {
    customForm: FormGroup;
    @Input() orgTaskId: number;
    subscriber: Subscription;
    coreState: OrgTaskCalendarQueryOptions;
    calendars: Array<OrgTaskCalendar>;

    submitted: boolean;
    constructor(public fb: FormBuilder, public service: OrgTaskCalendarService){
        this.coreState = new OrgTaskCalendarQueryOptions();

        const nextYearSessionEndDate = new Date();
        nextYearSessionEndDate.setDate(31);
        nextYearSessionEndDate.setMonth(4);
        nextYearSessionEndDate.setFullYear(nextYearSessionEndDate.getFullYear() + 1);

        const startDate = new Date();
        const startTime = '09:00';
        const endDate = nextYearSessionEndDate;
        const endTime = '21:00';

        this.customForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            remark: [null],
            startDate: [startDate, Validators.required],
            startTime: [startTime, Validators.required],
            endDate: [endDate, Validators.required],
            endTime: [endTime, Validators.required],
            orgTaskId:[null, Validators.required],
            inchargeId:[null],
            inchargeName:[null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formOrgTaskId(){ return this.customForm.get('orgTaskId'); }
    get formInchargeId(){ return this.customForm.get('inchargeId'); }
    get formInchargeName(){ return this.customForm.get('inchargeName'); }

    get actionType (){ return (this.customForm.get('id').value) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }

    updateInchargeId(val: any){
        const { id, name, userId } = val || {};
        this.formInchargeId.setValue(userId, { emitEvent: false});
        this.formInchargeName.setValue(name, { emitEvent: false});
    }

    populateForm(model) { this.customForm.patchValue(model); }

    createNew(){
        this.resetFormData(new OrgTaskCalendar({ orgTaskId: this.orgTaskId }));
    }

    changeCalendar(row: OrgTaskCalendar)
    {
        this.resetFormData(row);
    }

    resetFormData(model: OrgTaskCalendar){
        this.populateForm(model);
    }

    updateCalendars(state)
    {
        const success = (r)=> { this.calendars = (r.entities || []).map(r => new OrgTaskCalendar(r)); };
        const error = (r)=> {};
        this.subscriber = this.service.list(state).subscribe(success, error);
    }

    ngOnInit()
    {
        if(this.orgTaskId)
        {
            this.coreState.orgTaskId = this.orgTaskId;
            this.updateCalendars(this.coreState);
        }
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    saveForm(form){
        if (form.invalid) { return; }
        const success = (resp)=> {
            this.submitted = false;
            this.updateCalendars(this.coreState);
        };
        const error = (resp)=> { this.submitted = false; };

        this.submitted = true;
        const formValues = form.getRawValue();
        formValues.orgTaskId = this.orgTaskId;
        if(formValues.id) {
            this.subscriber = this.service.update(formValues.id, formValues).subscribe(success, error);
        } else {
            this.subscriber =  this.service.create(formValues).subscribe(success, error);
        }
    }
}
