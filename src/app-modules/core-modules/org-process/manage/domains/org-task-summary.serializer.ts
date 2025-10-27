import {CoreQueryOptions, CoreResource} from "@app-global";

export class OrgTaskSummaryRowQueryOptions extends CoreQueryOptions {
  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

/*export class SchedulerLogSummary {
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
}*/

/*export class OrgTaskCommunicationTemplate {
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

export class OrgScheduledNotification {
    name: string;
    templates: Array<OrgTaskCommunicationTemplate>;
    userType: string;

    constructor(model: any = <any>{}) {
        this.name = model.name;
        this.userType = model.userType;
        this.templates = (model.templates || []).map(r => new OrgTaskCommunicationTemplate(r));
    }
}

export class OrgTaskScheduler {
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

    notification: OrgScheduledNotification;
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

        this.notification = (model.notification)? new OrgScheduledNotification(model.notification): null;
        this.isLocked = model.isLocked;
    }

    //Target = k.Target,
    //TargetLink = k.TargetLink
}

export class OrgTaskReminder {
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
}*/

export class OrgTaskSummaryRow extends CoreResource {
    name: string;
    remark: string;
    isManual: boolean;
    isPrimary: boolean;
    taskPriorityId: number;
    taskPriorityName: string;

    totalTaskReminders: number;
    totalTaskSchedules: number;
    totalTaskCalendars: number;

    verifiedById: string;
    reportedToId: string;
    assignedToId: string;

    verifiedByName: string;
    reportedToName: string;
    assignedToName: string;

    nextDueDate: string;
    nextDueRun: any;

    isLocked: boolean;
    status: string;
    constructor(model: any = {}){
        super();
        const {
            id, name, remark,
            taskPriorityId, taskPriorityName, isManual, isPrimary,

            totalTaskReminders, totalTaskSchedules, totalTaskCalendars,
            verifiedById, reportedToId, assignedToId, verifiedByName, reportedToName, assignedToName,

            nextDueDate, nextDueRun,
            isLocked, status
        } = model;

        this.id = id;
        this.name = name;
        this.remark = remark;

        this.isManual = isManual;
        this.isPrimary = isPrimary;
        this.taskPriorityId = taskPriorityId;
        this.taskPriorityName = taskPriorityName;

        this.verifiedById = verifiedById;
        this.reportedToId = reportedToId;
        this.assignedToId = assignedToId;

        this.verifiedByName = verifiedByName;
        this.reportedToName = reportedToName;
        this.assignedToName = assignedToName;

        this.totalTaskReminders = totalTaskReminders;
        this.totalTaskSchedules = totalTaskSchedules;
        this.totalTaskCalendars = totalTaskCalendars;

        this.nextDueDate = nextDueDate;
        this.nextDueRun = nextDueRun;

        this.isLocked = isLocked;
        this.status = status;
    };
}

export class OrgTaskSummaryRowSerializer {
    fromJson(json: any): OrgTaskSummaryRow { return new OrgTaskSummaryRow(json); }

    toJson(data: any): any {
        data.orgProcessId = data.orgProcessId || data.orgParentProcessId;
        // Special handling for orgParentProcessId
        return data;
    }
}
