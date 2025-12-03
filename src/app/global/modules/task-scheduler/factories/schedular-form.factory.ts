import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DAYS, FREQUENCY_TYPE, MONTHS, WEEK_DAYS, WEEK_OF, YEAR_MODE_ENUM, YEAR_MODES} from "../../../enums";
import {Injector} from "@angular/core";
import {AppSetupService} from "../../../services";
import {OrgConfigOptions} from "../../../services/models/app-setup.serializer";
import {debounceTime, pairwise, startWith} from "rxjs";
import {DateHelper} from "../../../helpers";

function getYearRange(yearMode: YEAR_MODE_ENUM | any, fyStartMonth: number, fyStartDay: number) {
    const today = new Date();
    const year = today.getFullYear();

    if (yearMode === YEAR_MODE_ENUM.CALENDER_YEAR) {
        return {
            yearMode: YEAR_MODE_ENUM.CALENDER_YEAR,
            start: new Date(year, 0, 1),     // Jan 1
            end: new Date(year, 11, 31),     // Dec 31
        };
    }

    if (yearMode === YEAR_MODE_ENUM.FINANCIAL_YEAR) {
        const fyStart = new Date(year, fyStartMonth - 1, fyStartDay);

        // If today is before fiscal-year start, financial year belongs to previous year
        if (today < fyStart) {
            return {
                yearMode: YEAR_MODE_ENUM.FINANCIAL_YEAR,
                start: new Date(year - 1, fyStartMonth - 1, fyStartDay),
                end: new Date(year, fyStartMonth - 1, fyStartDay - 1),
            };
        }

        // Otherwise fiscal year is this year → next year
        return {
            yearMode: YEAR_MODE_ENUM.FINANCIAL_YEAR,
            start: new Date(year, fyStartMonth - 1, fyStartDay),
            end: new Date(year + 1, fyStartMonth - 1, fyStartDay - 1),
        };
    }

    return {
        yearMode: YEAR_MODE_ENUM.CUSTOM,
        start: today,
        end: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate() - 1)
    };
}
export class SchedularForm {
  weekDays: Array<any> = WEEK_DAYS;
  months: Array<any> = MONTHS;
  days: Array<any> = DAYS;
  weeksOf: Array<any> = WEEK_OF;
  yearModes: Array<any> = YEAR_MODES;

  customForm: FormGroup;
  orgConfig: OrgConfigOptions;
  public setupService: AppSetupService;
  constructor(public fb: FormBuilder, public injector: Injector) {
      this.setupService = injector.get(AppSetupService);
      this.orgConfig = this.setupService.appSetup.orgConfig;
      const { fyStartDay, fyStartMonth,
          ofcStartTime, ofcEndTime, } = this.orgConfig;
      this.customForm = this.fb.group({
          name: [null, Validators.required],
          yearMode: [null, Validators.required],
          fyStartDay: [null, Validators.required],
          fyStartMonth: [null, Validators.required],
          startDate: [null, Validators.required],
          startTime: [ofcStartTime, Validators.required],
          startTimeZone: [null, Validators.required],
          endDate: [null],
          endTime: [ofcEndTime, [ Validators.max(new Date().setHours(23, 59, 0, 0)) ]],
          endTimeZone: [null, Validators.required],
          hasNoExpiration: [false],

          orgTaskId:[null, Validators.required],
          frequencyTypeId:[null, Validators.required],
          afterSucessOnTaskId: [null],

          isTaskDelay: [false],
          taskDelayDuration: [null],
          isRepeatTask: [false],
          repeatTaskStart: [null],
          repeatTaskDuration: [null],
          isStopTaskAtEndRepetition: [false],
          isStopTaskIfLongerThan: [false],
          taskMaxDuration: [null],

          daily: this.dailyFormGroup(),
          weekly: this.weeklyFormGroup(),
          monthly: this.monthlyFormGroup(),
          event: this.eventFormGroup()
      });

      const itemFormValueChange = ([prev, next]: [number, number]) =>
      {
          if(prev != next)
          {
              const { start, end, yearMode} = getYearRange(next, fyStartMonth, fyStartDay);
              this.customForm.get('startDate').setValue(DateHelper.toDateControlFormat(start));
              this.customForm.get('endDate').setValue(DateHelper.toDateControlFormat(end));
              //this.customForm.get('startTime').setValue(ofcStartTime);
              //this.customForm.get('endTime').setValue(ofcEndTime);
              switch (yearMode) {
                  case YEAR_MODE_ENUM.CALENDER_YEAR:
                  case YEAR_MODE_ENUM.FINANCIAL_YEAR:
                      this.disableDateControl(this.customForm.get('startDate'), this.customForm.get('startTime'), true);
                      this.disableDateControl(this.customForm.get('endDate'), this.customForm.get('endTime'), true);
                      break;
                  case YEAR_MODE_ENUM.CUSTOM:
                      this.disableDateControl(this.customForm.get('startDate'), this.customForm.get('startTime'), false);
                      this.disableDateControl(this.customForm.get('endDate'), this.customForm.get('endTime'), false);
                      break;
              }
          }
      };

      this.customForm.get('yearMode').valueChanges.pipe(startWith(null as number), pairwise(), debounceTime(10)).subscribe(itemFormValueChange);
  }

  disableDateControl(dateControl, timeControl, isDisable){
      if (isDisable) {
          dateControl?.disable();
          //timeControl?.disable();
      } else {
          dateControl?.enable();
          //timeControl?.enable();
      }
  }

  dailyFormGroup(){
        return this.fb.group({
            dayInterval: [null, Validators.required],
            hourInterval: [null, Validators.required],
            minuteInterval: [null, Validators.required]
        })
    }
  weeklyFormGroup(){
        const dataItem = this.fb.group({
            weekInterval: [null, Validators.required],
            isAllWeekDay: [null, Validators.required],
            weekDayNo: this.fb.array([]),
        });

        (this.weekDays || []).map((val) => (<FormArray>dataItem.get('weekDayNo')).push(this.checkboxFormGroup(val)));
        return dataItem;
    }
  monthlyFormGroup(){
        const dataItem = this.fb.group({
            monthInterval: [null],
            isAllMonth: [null],
            monthNo: this.fb.array([]),

            isAllDay: [null],
            dayNo: this.fb.array([]),

            isAllWeek: [null],
            weekNo: this.fb.array([]),
            monthlyWeekDayNo: this.fb.array([]),
            on:['1']
        });
        (this.months || []).map((val) => (<FormArray>dataItem.get('monthNo')).push(this.checkboxFormGroup(val)));
        (this.days || []).map((val) => (<FormArray>dataItem.get('dayNo')).push(this.checkboxFormGroup(val)));
        (this.weeksOf || []).map((val) => (<FormArray>dataItem.get('weekNo')).push(this.checkboxFormGroup(val)));
        (this.weekDays || []).map((val) => (<FormArray>dataItem.get('monthlyWeekDayNo')).push(this.checkboxFormGroup(val)));
        return dataItem;
    }
  checkboxFormGroup(data){
        return this.fb.group({
            id: [data.id],
            name: [data.name],
            isChecked: [data.isChecked]
        });
    }
  eventFormGroup(){
        return this.fb.group({
            target: [null],
            targetLink: [null]
        });
    }

  get weekDaysList(){ return this.weekDays; }
  getFormControl(val){ return this.fb.control(val); }

  get formOrgTaskId(){ return <FormGroup>this.customForm.get('orgTaskId'); }
  get frequencyTypeId(){ return this.customForm.get('frequencyTypeId'); }

  get formDaily() { return <FormGroup>this.customForm.get('daily'); }
  get formWeekly() { return <FormGroup>this.customForm.get('weekly'); }
  get formMonthly() { return <FormGroup>this.customForm.get('monthly'); }
  get formEvent() { return <FormGroup>this.customForm.get('event'); }
  get formMonthlyDays(): FormArray { return <FormArray>this.formMonthly.get('dayNo'); }
  get formMonthlyWeekNo(): FormArray { return <FormArray>this.formMonthly.get('weekNo'); }
  get formMonthlyWeekDayNo(): FormArray { return <FormArray>this.formMonthly.get('monthlyWeekDayNo'); }

  updateFrequencyTypeId(val){ return this.frequencyTypeId.setValue(val); }

  get formWeeklyWeekNo(): FormArray{return <FormArray> this.formWeekly.get('weekDayNo'); }
  get formMonthlyMonthNo(): FormArray{ return <FormArray>this.formMonthly.get('monthNo'); }
  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  updateSchedularForm(data: any) {
    const {
      name, yearMode, startDate, startTime, startTimeZone, endTimeZone, endDate, endTime, hasNoExpiration,
      isTaskDelay,
      taskDelayDuration,
      isRepeatTask,
      repeatTaskStart,
      repeatTaskDuration,
      isStopTaskAtEndRepetition,
      isStopTaskIfLongerThan,
      taskMaxDuration
    } = data;
    const {
        fyStartDay, fyStartMonth,
        ofcStartTime,
        ofcEndTime,
        timeZone
    } = this.orgConfig;
    this.customForm.get('name').setValue(name);
    this.customForm.get('yearMode').setValue(yearMode || YEAR_MODE_ENUM.CALENDER_YEAR);
    this.customForm.get('fyStartDay').setValue(fyStartDay);
    this.customForm.get('fyStartMonth').setValue(fyStartMonth);

    this.customForm.get('startDate').setValue(startDate);
    this.customForm.get('startTime').setValue(startTime || ofcStartTime);
    this.customForm.get('startTimeZone').setValue(startTimeZone || timeZone);
    this.customForm.get('endDate').setValue(endDate);
    this.customForm.get('endTime').setValue(endTime || ofcEndTime);
    this.customForm.get('endTimeZone').setValue(endTimeZone || timeZone);
    this.customForm.get('hasNoExpiration').setValue(hasNoExpiration || false);

    this.customForm.get('frequencyTypeId').setValue(data.frequencyTypeId);
    this.customForm.get('orgTaskId').setValue(data.orgTaskId);
    this.customForm.get('afterSucessOnTaskId').setValue(data.afterSucessOnTaskId);

    this.customForm.get('isTaskDelay').setValue(isTaskDelay);
    this.customForm.get('taskDelayDuration').setValue(taskDelayDuration);
    this.customForm.get('isRepeatTask').setValue(isRepeatTask);
    this.customForm.get('repeatTaskStart').setValue(repeatTaskStart);
    this.customForm.get('repeatTaskDuration').setValue(repeatTaskDuration);
    this.customForm.get('isStopTaskAtEndRepetition').setValue(isStopTaskAtEndRepetition);
    this.customForm.get('isStopTaskIfLongerThan').setValue(isStopTaskIfLongerThan);
    this.customForm.get('taskMaxDuration').setValue(taskMaxDuration);
    this.customForm.get('taskMaxDuration').setValue(taskMaxDuration);
    this.updateDailyForm(data);
    this.updateWeeklyForm(data);
    this.updateMonthlyForm(data);

    this.formEvent.get('target').setValue(data.target);
    this.formEvent.get('targetLink').setValue(data.targetLink);
  }

  updateMiltiCheckboxControls(controlArrayForm, items){
    const updateVal = itemForm => {
        const v = (items || []).find(r => r.id == itemForm.value.id);
        itemForm.get('isChecked').setValue(v?.isChecked || false);
    };
    controlArrayForm.controls.map(updateVal);
  }

    updateFrequencyFormByType(masterFrequency){
      const { daily, monthly, weekly, event } = this.customForm.getRawValue();
      switch (masterFrequency) {
          case FREQUENCY_TYPE.DAILY:
              this.updateDailyForm(daily);
              break;
          case FREQUENCY_TYPE.WEEKLY:
              this.updateWeeklyForm(weekly);
              break;
          case FREQUENCY_TYPE.MONTHLY:
              this.updateMonthlyForm(monthly);
              break;
          case FREQUENCY_TYPE.ON_EVENT:
              break;
      }
    }

    createMultiselectOptions(str){
        return (str || '').split(',').filter(r => r).map(r => { return{ id: r, isChecked: true }}) || [];
    }

    updateDailyForm(data){
        this.formDaily.get('dayInterval').setValue(data.dayInterval || 1);
        this.formDaily.get('hourInterval').setValue(data.hourInterval || 0);
        this.formDaily.get('minuteInterval').setValue(data.minuteInterval || '00');
    }

    updateWeeklyForm(data){
        this.formWeekly.get('weekInterval').setValue(data.weekInterval || 1);
        this.formWeekly.get('isAllWeekDay').setValue(data.isAllWeekDay || false);
        this.updateMiltiCheckboxControls(this.formWeeklyWeekNo, data.weekDayNo);
    }

    updateMonthlyForm(data){
        this.formMonthly.get('monthInterval').setValue(data.monthInterval || 1);
        this.formMonthly.get('isAllMonth').setValue(data.isAllMonth || false);
        this.updateMiltiCheckboxControls(this.formMonthlyMonthNo, data.monthNo);

        this.formMonthly.get('on').setValue(data.on || '1');
        switch (data.on){
            case 1:
            case '1':
                //this.formMonthly.get('isAllDay').setValue(data.isAllDay || true);
                this.updateMiltiCheckboxControls(this.formMonthlyDays, data.dayNo);
                break;
            case 2:
            case '2':
                //this.formMonthly.get('isAllWeek').setValue(data.isAllWeek || true);
                this.updateMiltiCheckboxControls(this.formMonthlyWeekNo, data.weekNo);
                this.updateMiltiCheckboxControls(this.formMonthlyWeekDayNo, data.monthlyWeekDayNo);
                break;
        }
    }
}
