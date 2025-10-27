import {CoreQueryOptions} from "@app-global";

export class MyTaskQueryOptions extends CoreQueryOptions {
  orgTaskId: any;
  view: string;
  orgUserId: string;
  taskPriorityId: any;

  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {
      orgTaskId: this.orgTaskId,
      view: 'task',
      orgUserId: this.orgUserId,
      taskPriorityId: this.taskPriorityId
    };
    return super.getParamByObject(obj);
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
  isFeeType: boolean;
  isPeriodType: boolean;
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
    this.isFeeType = model.isFeeType;
    this.isPeriodType = model.isPeriodType;
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

export class OrgProcess {
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

class CommonSchedule {
    id: number;
    orgTaskId: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;

    constructor(model: any = <any>{}){
        const { id, orgTaskId, startDate, startTime, endDate, endTime, description } = model || {};
        this.id = id;
        this.orgTaskId = orgTaskId;
        this.startDate = startDate;
        this.startTime = startTime || '09:00';
        this.endDate = endDate;
        this.endTime = endTime || '19:00';
        this.description = description;
    }
}

export class TaskRunLog {
    id: number;
    startDate: string;
    endDate: string;
    dueDate: string;
    result: string;
    remark: string;
    orgTaskScheduleId: number;
    taskStatusTypeId: number;

    verificationRemark: string;
    verifiedByEmployeeId: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;

    constructor(model: any = <any>{}){
        const { id, startDate, endDate, dueDate, result, remark, orgTaskScheduleId, taskStatusTypeId,
            verificationRemark, verifiedByEmployeeId, verifiedByEmployeeName, taskStatusTypeName
        } = model || {};

        this.id = id;
        this.dueDate = dueDate;
        this.startDate = startDate || dueDate;
        this.endDate = endDate || dueDate;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.taskStatusTypeId = taskStatusTypeId;
        this.taskStatusTypeName = taskStatusTypeName;

        this.result = result;
        this.remark = remark;

        this.verificationRemark = verificationRemark;
        this.verifiedByEmployeeId = verifiedByEmployeeId;
        this.verifiedByEmployeeName = verifiedByEmployeeName;
    }

    public get controlStartDate(){ return this.startDate; }
    public get controlEndDate(){ return this.endDate; }
}

class Project {
    taskMapperId: number;
    processId: number;
    orgTaskId: number;
    projectId: number;
    moduleId: number;

    processName: string;
    moduleName: string;
    projectName: string;
    constructor(model: any = <any>{}){
        const { taskMapperId, processId, orgTaskId, projectId, moduleId, processName, moduleName, projectName } = model || {};

        this.taskMapperId = taskMapperId;
        this.processId = processId;
        this.orgTaskId = orgTaskId;
        this.projectId = projectId;
        this.moduleId = moduleId;
        this.processName = processName;
        this.moduleName = moduleName;
        this.projectName = projectName;
    }
}

export class TaskSchedule extends CommonSchedule {
    lastRunSchedule: TaskRunLog;
    nextRunSchedule: TaskRunLog;
    todayRunSchedule: TaskRunLog;

    constructor(model: any = <any>{}){
        super(model);
        const { lastRunSchedule, nextRunSchedule, todayRunSchedule } = model || {};
        this.lastRunSchedule = lastRunSchedule ? new TaskRunLog(lastRunSchedule): null;
        this.nextRunSchedule = nextRunSchedule ? new TaskRunLog(nextRunSchedule): null;
        this.todayRunSchedule = todayRunSchedule? new TaskRunLog(todayRunSchedule): null;
    }
}

export class MyTask {
  id: string;
  name: string;
  taskType: string; // just to show
  masterType: string; // just to show
  taskTypeId: number;
  orgProcessId: number;
  isManual: boolean;
  isPrimary: boolean;
  isVerificationRequired: boolean;
  isStatusOnMailRequired: boolean;
  isStatusOnMailDaily: boolean;
  isStatusOnMailWeekly: boolean;
  isStatusOnMailMonthly: boolean;
  defaultFrequencyTypeId: number;
  defaultDay: number;
  defaultMonth: number;
  remark: string;
  status: string;

  createdDate: string;
  orgTaskSchedule: Array<OrgTaskScheduler>;
  orgReminders: Array<OrgReminder>;
  triggers: Array<string>;
  orgParentProcessId: number;
  isInValidForSession: boolean;
  orgProcess: OrgProcess;

  verifiedById: string;
  assignedToId: string;
  reportedToId: string;

  verifiedByName: string;
  assignedToName: string;
  reportedToName: string;

  schedules: Array<TaskSchedule>;
  lastRunLog: TaskRunLog;
  nextRunLog: TaskRunLog;
  project: Project;
  constructor(model: any = <any>{}) {
    const {
        orgProcess,
        verifiedById, assignedToId, reportedToId, verifiedByName, assignedToName, reportedToName,
        project, schedules, lastRunLog, nextRunLog
    } = model;

    this.id = model.id;
    this.name = model.name;
    this.status = model.status;
    this.taskType = model.taskType;
    this.masterType = model.masterType;
    this.createdDate = model.createdDate;
    //this.orgTaskSchedule = (model.orgTaskSchedule || []).map((r) => new OrgTaskScheduler(r));
    this.orgReminders = (model.orgReminders || []).map((r) => new OrgReminder(r));

    this.triggers = (this.orgTaskSchedule || []).reduce((prev, curr) => {
      prev.push(curr.orgTaskScheduleDescription);
      return prev;
    }, []);

    this.taskTypeId = model.taskTypeId;
    this.orgProcessId = model.orgProcessId;
    this.isManual = model.isManual;
    this.isPrimary = model.isPrimary;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isStatusOnMailRequired = model.isStatusOnMailRequired;
    this.isStatusOnMailDaily = model.isStatusOnMailDaily;
    this.isStatusOnMailWeekly = model.isStatusOnMailWeekly;
    this.isStatusOnMailMonthly = model.isStatusOnMailMonthly;
    this.defaultFrequencyTypeId = model.defaultFrequencyTypeId;
    this.defaultDay = model.defaultDay;
    this.defaultMonth = model.defaultMonth;
    this.remark = model.remark;
    this.orgParentProcessId = model.orgParentProcessId;
    this.isInValidForSession = (this.orgTaskSchedule || []).some(r => !r.isValidForSession);
    this.orgProcess = new OrgProcess(orgProcess || {});

    this.verifiedById = verifiedById;
    this.verifiedByName = verifiedByName;
    this.assignedToId = assignedToId;
    this.assignedToName = assignedToName;
    this.reportedToId = reportedToId;
    this.reportedToName = reportedToName;

    this.schedules = (schedules || []).map(r => new TaskSchedule(r));
    this.lastRunLog = new TaskRunLog(lastRunLog || {});
    this.nextRunLog = new TaskRunLog(nextRunLog || {});
    this.project = project ? new Project(project): null;
  }
}

export class MyTaskSerializer {
  fromJson(json: any): MyTask { return new MyTask(json); }

  toJson(data: any): any {
    data.orgProcessId = data.orgProcessId || data.orgParentProcessId;
    // Special handling for orgParentProcessId
    return data;
  }
}
