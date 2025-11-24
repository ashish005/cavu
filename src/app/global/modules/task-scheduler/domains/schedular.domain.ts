import {FREQUENCY_TYPE} from "../../../enums";
import {CoreQueryOptions} from "../../../services/models";

export class SchedulerTaskParam extends CoreQueryOptions{
    processMasterType: string;
    //showFeePLanTasks: boolean;
    //IsPeriodType: boolean;

    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            processMasterType: this.processMasterType,
            //showFeePLanTasks: this.showFeePLanTasks,
            //IsPeriodType: this.IsPeriodType
        };
        return super.getParamByObject(obj);
    }
}

export class SchedulerTask {
  id: number;
  name: string;
  processId: number;
  parentProcessId: number;
  constructor(model: any = <any>{}){
    const { id, name, processId, parentProcessId } = model;
    this.id = id;
    this.name = name;
    this.processId = processId;
    this.parentProcessId = parentProcessId;
  }
}

/*export class SchedulerProcess {
  id: number;
  name: string;
  masterType: string;
  sortOrder: number;
  tasks: Array<SchedulerTask>;
  subProcess: Array<SchedulerProcess>;
  hasTask: boolean = false;
  taskCount: number = 0;

  constructor(model: any = <any>{}){
    const { id, name, masterType, sortOrder, tasks, subProcess } = model;
    this.id = id;
    this.name = name;
    this.masterType = masterType;
    this.sortOrder = sortOrder;
    this.tasks = (tasks || []).map(r => new SchedulerTask(r));
    this.subProcess = (subProcess || []).map(r => new SchedulerProcess(r));
    this.taskCount = this.getActiveTasks().length;
    this.hasTask = (this.taskCount>0);
  }

  getActiveTasks(){
    return (this.subProcess || []).reduce((result, curr)=>{
      result = result.concat(curr.tasks);
      return result;
    }, this.tasks || []);
  }
}*/

export class SchedularDomain {
    id: any;
    name: string;
    startDate: string;
    startTime: string;
    startTimeZone: string;
    endDate: string;
    endTime: string;
    endTimeZone: string;
    hasNoExpiration: boolean;
    frequencyTypeId: number;
    frequencyMasterType: string;
    orgTaskId: number;

    isManual: boolean;
    isFeeTask: boolean;
    /*Daily*/
    dayInterval: number;
    hourInterval: number;
    minuteInterval: number;

    /*Weekly*/
    weekInterval: number;
    isAllWeekDay: boolean; //For week and month
    weekDayNo: Array<string>; //For week and month

    /*Monthly*/
    isAllDay: boolean;
    dayNo: string | string[];
    isAllWeek: boolean;
    weekNo: string | string[];
    monthlyWeekDayNo: string | string[];
    isAllMonth: boolean;
    monthNo: string;
    monthInterval: number;
    on: string;

    /*On Event*/
    target: string;
    targetLink: string;

    afterSucessOnTaskId: number;

    isTaskDelay: boolean;
    taskDelayDuration: number;
    isRepeatTask: boolean;
    repeatTaskStart: number;
    repeatTaskDuration: number;
    isStopTaskAtEndRepetition: boolean;
    isStopTaskIfLongerThan: boolean;
    taskMaxDuration: number;

    lastRun: any;
    constructor(model: any = <any>{}){
        const { id, name, startDate, startTime, startTimeZone, hasNoExpiration, endDate, endTime, endTimeZone, frequencyTypeId, orgTaskId, isManual, isFeeTask} = model || {};
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.startTime = startTime;
        this.startTimeZone = startTimeZone;
        this.hasNoExpiration = hasNoExpiration || false;
        this.endDate = endDate;
        this.endTime = endTime;
        this.endTimeZone = endTimeZone;
        this.frequencyTypeId = frequencyTypeId || null;
        this.orgTaskId = orgTaskId || null;
        this.isManual = isManual;
        this.isFeeTask = isFeeTask;

        this.dayInterval = model.dayInterval || null;
        this.hourInterval = model.hourInterval || null;
        this.minuteInterval = model.minuteInterval || null;

        this.weekInterval = model.weekInterval || null;
        this.isAllWeekDay = model.isAllWeekDay || false;
        this.weekDayNo = model.weekDayNo || null;

        /*Monthly*/
        this.isAllDay = model.isAllDay || null;
        this.dayNo = model.dayNo || null;
        this.isAllWeek = model.isAllWeek || null;
        this.weekNo = model.weekNo || null;
        this.monthlyWeekDayNo = model.monthlyWeekDayNo;
        this.isAllMonth = model.isAllMonth || null;
        this.monthInterval = model.monthInterval || null;
        this.monthNo = model.monthNo || null;
        this.on = model.on;

        /*On Event*/
        this.target = model.target || null;
        this.targetLink = model.targetLink || null;

        this.afterSucessOnTaskId = model.afterSucessOnTaskId || null;

        this.isTaskDelay = model.isTaskDelay || false;
        this.taskDelayDuration = model.taskDelayDuration;
        this.isRepeatTask = model.isRepeatTask || false;
        this.repeatTaskStart = model.repeatTaskStart;
        this.repeatTaskDuration = model.repeatTaskDuration;
        this.isStopTaskAtEndRepetition = model.isStopTaskAtEndRepetition || false;
        this.isStopTaskIfLongerThan = model.isStopTaskIfLongerThan || false;
        this.taskMaxDuration = model.taskMaxDuration;
        this.lastRun = model.lastRun;
    }

    updateCommon(model: any = <any>{}){
        this.name = model.name;
        this.startDate = model.startDate;
        this.startTime = model.startTime;
        this.endDate = model.endDate;
        this.endTime = model.endTime;
        this.frequencyTypeId = model.frequencyTypeId;
        this.afterSucessOnTaskId = model.afterSucessOnTaskId || null;
    }

    updateDaily(model: any = <any>{}){
        this.dayInterval = model.dayInterval || null;
        this.hourInterval = model.hourInterval;
        this.minuteInterval = model.minuteInterval;
    }

    updateWeekly(model: any = <any>{}){
        this.weekInterval = model.weekInterval || 1;
        this.isAllWeekDay = model.isAllWeekDay || false;

        if(Array.isArray(model.weekDayNo)){
            this.weekDayNo = (model.weekDayNo ||[]).filter(r=> r.isChecked).map(k => k.id).join(',');
        } else {
            this.weekDayNo = model.weekDayNo;
        }
    }

    updateMonthly(model: any = <any>{}){
        this.isAllDay = model.isAllDay;
        this.isAllWeek = model.isAllWeek;
        //this.isAllWeekDay = model.isAllWeekDay;
        this.monthInterval = model.monthInterval || null;
        this.isAllMonth = model.isAllMonth;
        this.monthNo = this.getCheckedRecords(model.monthNo);

        this.dayNo = this.getCheckedRecords(model.dayNo);

        this.monthlyWeekDayNo = this.getCheckedRecords(model.monthlyWeekDayNo);
        this.weekNo = this.getCheckedRecords(model.weekNo);

        switch (model.on){
            case '1':
                this.dayNo = this.dayNo || '1';
                this.weekNo = null;
                this.monthlyWeekDayNo = null;
                break;
            case '2':
                this.dayNo = null;
                this.weekNo = this.weekNo || '1';
                this.monthlyWeekDayNo  = this.monthlyWeekDayNo || '1';
                break;
            default:
                break;
        }
    }

    getCheckedRecords = (items) => {
        return Array.isArray(items) ? (items || []).filter(r => r.isChecked).map(k => k.id).join(','): items;
    }

    updateOnEvent(model: any = <any>{}) {
        this.target = model.target || null;
        this.targetLink = model.targetLink || null;
    }

    onlyPopulateFrequencyValues(frequencyMasterType: string) {
        this.frequencyMasterType = frequencyMasterType;
        if(this.hasNoExpiration) {
            this.endDate = null;
            this.endTime = null;
            this.endTimeZone = null;
        }

        if (FREQUENCY_TYPE.DAILY != frequencyMasterType)
        {
            //daily
            this.dayInterval = null;
            this.hourInterval = null;
            this.minuteInterval = null;
        }

        if (FREQUENCY_TYPE.WEEKLY != frequencyMasterType)
        {
            //weekly
            this.weekInterval = null;
            this.isAllWeekDay = false;
            this.weekDayNo = null;
        }

        if (FREQUENCY_TYPE.MONTHLY != frequencyMasterType)
        {
            //monthly
            this.isAllMonth = null;
            this.monthInterval = null;
            this.monthNo = null;

            this.isAllDay = null;
            this.dayNo = null;

            this.isAllWeek = null;
            this.weekNo = null;
            this.monthlyWeekDayNo = null;
        } else {
            //days
            switch (this.on) {
                case '1':
                    this.isAllWeek = null;
                    this.weekNo = null;
                    this.monthlyWeekDayNo = null;
                    break;
                case '2':
                    this.isAllDay = null;
                    this.dayNo = null;
                    break;
            }
        }
    }

    public get desc() {
        const endTime = (this.hasNoExpiration || !this.endDate) ? 'No Expiry': `${this.endDate} ${this.endTime}`;
        const arr = [
            this.frequencyMasterType,
            `: ${this.startDate} ${this.startTime} - ${ endTime }`,
        ];
        return arr.join(' ');
    }
}
export class SchedularParser {
    static parseDetails(model: any = {}) {
        const data = {
            name:  model.name || null,
            startDate: model.startDate,
            startTime: model.startTime,
            startTimeZone: model.startTimeZone,
            endDate: model.endDate,
            endTime: model.endTime,
            endTimeZone: model.endTimeZone,
            frequencyTypeId: model.frequencyTypeId,
            orgTaskId: model.orgTaskId,
            hasNoExpiration: model.hasNoExpiration || false,

            dayInterval: model.dayInterval,
            hourInterval: model.hourInterval,
            minuteInterval: model.minuteInterval,

            weekInterval: model.weekInterval,
            isAllWeekDay: model.isAllWeekDay,
            weekDayNo: (model.weekDayNo || '').split(',').filter(r => r).map(r => { return{ id: r, isChecked: true }}) || [],

            isAllDay: model.isAllDay,
            dayNo: (model.dayNo || '').split(',').filter(r => r).map(r => { return { id: r, isChecked: true }}) || [],
            weekNo: (model.weekNo || '').split(',').filter(r => r).map(r => { return { id: r, isChecked: true }}) || [],
            isAllMonth: model.isAllMonth,
            monthNo:(model.monthNo || '').split(',').filter(r => r).map(r => { return { id: r, isChecked: true }}) || [],
            monthInterval: model.monthInterval,
            isAllWeek: model.isAllWeek,
            monthlyWeekDayNo: (model.monthlyWeekDayNo || '').split(',').filter(r => r).map(r => { return{ id: r, isChecked: true }}) || [],
            on: (model.weekNo || model.monthlyWeekDayNo)? '2': '1',

            afterSucessOnTaskId: model.afterSucessOnTaskId,

            target: model.target,
            targetLink: model.targetLink,

            isTaskDelay: model.isTaskDelay || false,
            taskDelayDuration: model.taskDelayDuration,
            isRepeatTask: model.isRepeatTask || false,
            repeatTaskStart: model.repeatTaskStart,
            repeatTaskDuration: model.repeatTaskDuration,
            isStopTaskAtEndRepetition: model.isStopTaskAtEndRepetition || false,
            isStopTaskIfLongerThan: model.isStopTaskIfLongerThan || false,
            taskMaxDuration: model.taskMaxDuration
        };
        return data;
    }
    /*static serializeDetails(model: SchedularDomain) { return model; }*/
}


export class SchedularDomainSerializer {
    fromJson(json: any): SchedularDomain { return new SchedularDomain(json); }
    toJson(data: any): any { return data; }
}