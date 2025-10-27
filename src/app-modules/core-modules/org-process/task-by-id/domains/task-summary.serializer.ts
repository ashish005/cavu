import {CoreQueryOptions, CoreResource} from "@app-global";
class OrgProcess {
    id: number;
    name: string;
    description: string;
    processStatus: string;
    processStatusOn: string;
    manualStatus: string;
    manualStatusOn: string;

    constructor(model: any = <any>{}) {
        const { id, name, description, processStatus, processStatusOn, manualStatus, manualStatusOn } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.processStatus = processStatus;
        this.processStatusOn = processStatusOn;
        this.manualStatus = manualStatus;
        this.manualStatusOn = manualStatusOn;
    }
}
class OrgTaskCommon extends CoreResource {
    name: string;
    remark: string;

    defaultFrequencyTypeId: number;
    //taskTypeId: number;
    taskPriorityId: number;
    orgProcessId: number;

    isManual: boolean;
    isPrimary: boolean;

    //masterType: string;
    isVerificationRequired: boolean;
    isStatusOnMailRequired: boolean;
    isStatusOnMailDaily: boolean;
    isStatusOnMailWeekly: boolean;
    isStatusOnMailMonthly: boolean;

    verifiedById: string;
    reportedToId: string;
    assignedToId: string;

    defaultDay: number;
    defaultMonth: number;

    isLocked: boolean;
    status: string;

    verifiedByName: string;
    reportedToName: string;
    assignedToName: string;

    defaultFrequencyTypeName: string;
    //taskTypeName: string;
    taskPriorityName: string;

    isFeeTask:  boolean;
    isPeriodType:  boolean;
    orgProcess: OrgProcess;
    constructor(model: any = {}){
        super();
        const {
            id, name,
            taskPriorityId,
            isVerificationRequired, isStatusOnMailRequired,
            isStatusOnMailDaily, isStatusOnMailWeekly, isStatusOnMailMonthly,
            verifiedById, reportedToId,
            defaultFrequencyTypeId,
            defaultDay, defaultMonth, remark,
            isManual, isPrimary, orgProcessId, assignedToId,
            verifiedByName, reportedToName, assignedToName,
            defaultFrequencyTypeName, taskPriorityName,
            isLocked, status,
            isFeeTask, isPeriodType,
            orgProcess
        } = model;

        this.id = id;
        this.name = name;
        this.remark = remark;

        this.taskPriorityId = taskPriorityId;

        this.isVerificationRequired = isVerificationRequired;
        this.isStatusOnMailRequired = isStatusOnMailRequired;
        this.isStatusOnMailDaily = isStatusOnMailDaily;
        this.isStatusOnMailWeekly = isStatusOnMailWeekly;
        this.isStatusOnMailMonthly = isStatusOnMailMonthly;
        this.verifiedById = verifiedById;
        this.reportedToId = reportedToId;
        this.defaultFrequencyTypeId = defaultFrequencyTypeId;
        this.defaultDay = defaultDay;
        this.defaultMonth = defaultMonth;

        this.isManual = isManual;
        this.isPrimary = isPrimary;

        this.isLocked = isLocked;
        this.status = status;

        this.orgProcessId = orgProcessId;
        this.assignedToId = assignedToId;

        this.verifiedByName = verifiedByName;
        this.reportedToName = reportedToName;
        this.assignedToName = assignedToName;

        this.defaultFrequencyTypeName = defaultFrequencyTypeName;
        this.taskPriorityName = taskPriorityName;

        this.isFeeTask = isFeeTask;
        this.isPeriodType = isPeriodType;
        this.orgProcess = new OrgProcess(orgProcess || {});
    }
}

export class TaskSummaryRowQueryOptions extends CoreQueryOptions {
  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

class SchedulerLogSummary {
    id: any;
    startDate: string;
    endDate: string;
    dueDate: string;

    remark: string;

    orgTaskScheduleId: number;
    taskStatusTypeId: number;
    verifiedByEmployeeId: string;

    verificationRemark: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;
    constructor(model: any = <any>{}){
        const {
            id,
            startDate, endDate, dueDate, remark,
            orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName
        } = model || {};
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dueDate = dueDate;

        this.remark = remark || null;

        this.orgTaskScheduleId = orgTaskScheduleId || null;
        this.taskStatusTypeId = taskStatusTypeId;
        this.verifiedByEmployeeId = verifiedByEmployeeId;

        this.verificationRemark = verificationRemark;
        this.verifiedByEmployeeName = verifiedByEmployeeName;
        this.taskStatusTypeName = taskStatusTypeName;
    }
}

class TaskCommunicationTemplate {
    id: number;
    notificationId: number;
    mediaTypeId: number;
    orgTaskScheduleId: number;
    isTaskReminder: boolean;
    mediaType: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.notificationId = model.notificationId;
        this.mediaTypeId = model.mediaTypeId;
        this.orgTaskScheduleId = model.orgTaskScheduleId;
        this.isTaskReminder = model.isTaskReminder;
        this.mediaType = model.mediaType;
    }
}

class TaskScheduledNotification {
    name: string;
    templates: Array<TaskCommunicationTemplate>;
    userType: string;

    constructor(model: any = <any>{}) {
        this.name = model.name;
        this.userType = model.userType;
        this.templates = (model.templates || []).map(r => new TaskCommunicationTemplate(r));
    }
}

class TaskScheduler {
    id: string;
    orgTaskId: number;
    frequencyTypeId: number;

    orgTaskScheduleDescription: string;
    status: boolean;
    orgTaskName: string;
    frequencyType: string;
    frequencyMasterType: string;
    isFeeType: boolean;
    isPeriodType: boolean;
    isValidForSession: boolean;

    notification: TaskScheduledNotification;
    isLocked: boolean;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.orgTaskId = model.orgTaskId;
        this.frequencyTypeId = model.frequencyTypeId;
        this.orgTaskScheduleDescription = model.orgTaskScheduleDescription;

        this.status = model.status;
        this.orgTaskName = model.orgTaskName;
        this.frequencyType = model.frequencyType;
        this.frequencyMasterType = model.frequencyMasterType;
        this.isFeeType = model.isFeeType;
        this.isPeriodType = model.isPeriodType;
        this.isValidForSession = model.isValidForSession;

        this.notification = (model.notification)? new TaskScheduledNotification(model.notification): null;
        this.isLocked = model.isLocked;
    }

    //Target = k.Target,
    //TargetLink = k.TargetLink
}

class TaskReminder {
    id: number;
    orgTaskScheduleId: number;
    userGroupId: number;
    notificationId: number;
    frequencyType: string;
    reminderValue: string;
    name: string;
    //templates: Array<OrgTaskCommunicationTemplate>;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.orgTaskScheduleId = model.orgTaskScheduleId;
        this.userGroupId = model.userGroupId;
        this.notificationId = model.notificationId;
        this.frequencyType = model.frequencyType;
        this.reminderValue = model.reminderValue;
        this.name = model.name;
        //this.templates = (model.templates || []).map((r) => new OrgTaskCommunicationTemplate(r));
    }
}

export class TaskSummaryRow extends OrgTaskCommon {
    orgTaskSchedule: Array<TaskScheduler>;
    orgReminders: Array<TaskReminder>;
    triggers: Array<string>;
    orgParentProcessId: number;
    isInValidForSession: boolean;

    schedules: Array<SchedulerLogSummary>;
    lastRunLog: SchedulerLogSummary;
    nextRunLog: SchedulerLogSummary;

    constructor(model: any = <any>{}) {
        super(model);
        const { schedules, lastRunLog, nextRunLog } = model;

        this.orgTaskSchedule = (model.orgTaskSchedule || []).map((r) => new TaskScheduler(r));
        this.orgReminders = (model.orgReminders || []).map((r) => new TaskReminder(r));
        this.triggers = (this.orgTaskSchedule || []).reduce((prev, curr) => {
            prev.push(curr.orgTaskScheduleDescription);
            return prev;
        }, []);

        this.isInValidForSession = (this.orgTaskSchedule || []).some(r => !r.isValidForSession);

        this.schedules = (schedules || []).map(r => new SchedulerLogSummary(r));
        this.lastRunLog = lastRunLog ? new SchedulerLogSummary(lastRunLog || {}) : null;
        this.nextRunLog = nextRunLog ? new SchedulerLogSummary(nextRunLog || {}) : null;
    }

    /*getRecipients(): Array<NotificationUser> {
        const recipients: Array<NotificationUser> = [];

        if(this.verifiedById) {
            recipients.push(new NotificationUser({ userId: this.verifiedById, name: this.verifiedByName }));
        }
        if(this.reportedToId) {
            recipients.push(new NotificationUser({ userId: this.reportedToId, name: this.reportedToName }));
        }
        if(this.assignedToId) {
            recipients.push(new NotificationUser({ userId: this.assignedToId, name: this.assignedToName }));
        }
        return recipients;
    }*/
}

export class TaskSummaryRowSerializer {
    fromJson(json: any): TaskSummaryRow { return new TaskSummaryRow(json); }

    toJson(data: any): any {
        return data;
    }
}
