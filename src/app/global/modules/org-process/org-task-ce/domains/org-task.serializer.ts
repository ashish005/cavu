import {CoreQueryOptions, CoreResource} from "../../../../core-setup";

export class OrgTaskQueryOptions extends CoreQueryOptions {
  orgTaskId: any;
  view: string;
  orgUserId: string;

  constructor(model: any = {}){
    super(model);
  }

  toQueryString (){
    const obj = {
      orgTaskId: this.orgTaskId,
      view: this.view,
      orgUserId: this.orgUserId
    };
    return super.getParamByObject(obj);
  }
}

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

export class OrgTaskCommunicationTemplate {
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

export class OrgScheduledFeeStructure {
  name: string;
  courseName: string;
  feePlanId: number;
  feeTypeId: number;

  constructor(model: any = <any>{}) {
    this.name = model.name;
    this.courseName = model.courseName;
    this.feePlanId = model.feePlanId;
    this.feeTypeId = model.feeTypeId;
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
  // isFeeType: boolean;
  // isPeriodType: boolean;
  isValidForSession: boolean;

  feeStructures: Array<OrgScheduledFeeStructure>;
  notification: OrgScheduledNotification;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.orgTaskId = model.orgTaskId;
    this.frequencyTypeId = model.frequencyTypeId;
    this.orgTaskScheduleDescription = model.orgTaskScheduleDescription;

    this.status = model.status;
    this.orgTaskName = model.orgTaskName;
    this.frequencyType = model.frequencyType;
    this.frequencyMasterType = model.frequencyMasterType;
    // this.isFeeType = model.isFeeType;
    // this.isPeriodType = model.isPeriodType;
    this.isValidForSession = model.isValidForSession;

    this.feeStructures = (model.feeStructures || []).map((r) => new OrgScheduledFeeStructure(r));
    this.notification = (model.notification)? new OrgScheduledNotification(model.notification): null;
  }

  //Target = k.Target,
  //TargetLink = k.TargetLink
}

export class OrgReminder {
  id: number;
  orgTaskId: number;
  userGroupId: number;
  notificationId: number;
  frequencyType: string;
  reminderValue: string;
  name: string;
  templates: Array<OrgTaskCommunicationTemplate>;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.orgTaskId = model.orgTaskId;
    this.userGroupId = model.userGroupId;
    this.notificationId = model.notificationId;
    this.frequencyType = model.frequencyType;
    this.reminderValue = model.reminderValue;
    this.name = model.name;
    this.templates = (model.templates || []).map((r) => new OrgTaskCommunicationTemplate(r));
  }
}

export class OrgTask extends CoreResource {
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

      nextRunTime: string;
      lastRunTime: string;
      lastRunResult: string;
      createdDate: string;
      orgTaskSchedule: Array<OrgTaskScheduler>;
      orgReminders: Array<OrgReminder>;
      triggers: Array<string>;
      orgParentProcessId: number;
      isInValidForSession: boolean;

  constructor(model: any = <any>{}) {
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
          orgProcess, orgTaskSchedule, orgReminders
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

    this.orgTaskSchedule = (orgTaskSchedule || []).map((r) => new OrgTaskScheduler(r));
    this.orgReminders = (orgReminders || []).map((r) => new OrgReminder(r));

    this.triggers = (this.orgTaskSchedule || []).reduce((prev, curr) => {
      prev.push(curr.orgTaskScheduleDescription);
      return prev;
    }, []);

    this.isInValidForSession = (this.orgTaskSchedule || []).some(r => !r.isValidForSession);
  }
}

export class OrgTaskSerializer {
  fromJson(json: any): OrgTask { return new OrgTask(json); }

  toJson(data: any): any {
    data.orgProcessId = data.orgProcessId || data.orgParentProcessId;
    // Special handling for orgParentProcessId
    return data;
  }
}
