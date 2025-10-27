import {CoreQueryOptions, CoreResource} from "@app-global";

export class TaskReminderQueryOptions extends CoreQueryOptions {
    orgUserId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}

export class NextScheduledRun {
    id: number;
    startDate: string;
    endDate: string;
    dueDate: string;

    isAutoRun: boolean;
    isSuccess: boolean;

    remark: string;
    orgTaskScheduleId: number;
    taskStatusTypeId: number;
    verifiedByEmployeeId: string;

    verificationRemark: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;

    name: string;
    orgTaskTypeName: string;
    frequencyTypeName: string;

    taskPriorityName: string;
    orgProcessName: string;
    projectProcessName: string;
    constructor(model: any = <any>{}) {
        const {
            id,
            startDate, endDate, dueDate, isAutoRun,
            remark, orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName,
            name, orgTaskTypeName, frequencyTypeName,
            taskPriorityName, orgProcessName, projectProcessName
        }=  model;

        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dueDate = dueDate;

        this.isAutoRun = isAutoRun;

        this.remark = remark;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.taskStatusTypeId = taskStatusTypeId;
        this.verifiedByEmployeeId = verifiedByEmployeeId;

        this.verificationRemark = verificationRemark;
        this.verifiedByEmployeeName = verifiedByEmployeeName;
        this.taskStatusTypeName = taskStatusTypeName;

        this.name = name;
        this.orgTaskTypeName = orgTaskTypeName;
        this.frequencyTypeName = frequencyTypeName;

        this.taskPriorityName = taskPriorityName;
        this.orgProcessName = orgProcessName;
        this.projectProcessName = projectProcessName;
    }
}
export class ReminderTemplate {
    id: number | string;

    sortOrder: number;
    hasHeader: boolean;
    hasTemplate: boolean;
    hasFooter: boolean;

    templateCode: string;
    header: string;
    content: string;

    isTaskReminder: boolean;
    isDefaultFooter: boolean;

    notificationId: number;
    orgTaskId: number;
    orgTaskScheduleId: number;
    mediaTypeId: number;

    mediaTypeName: string;
    status: boolean;

    constructor(model: any = <any>{}){
        const {
            id,
            sortOrder, hasHeader, hasTemplate, hasFooter,
            templateCode, header, content,
            isDefaultFooter, isTaskReminder,
            notificationId, orgTaskId, orgTaskScheduleId, mediaTypeId,
            status,
            mediaTypeName
        } = model;
        this.id = id;

        this.sortOrder = sortOrder;
        this.hasTemplate = hasTemplate;
        this.hasHeader = hasHeader;
        this.hasFooter = hasFooter;

        this.templateCode = templateCode;
        this.header = header;
        this.content = content;

        this.isDefaultFooter = isDefaultFooter;
        this.isTaskReminder = isTaskReminder;

        this.notificationId = notificationId;
        this.orgTaskId = orgTaskId;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.mediaTypeId = mediaTypeId;

        this.status = status;
        this.mediaTypeName = mediaTypeName;
    }
}

export class TaskReminder extends CoreResource
{
    id: number;
    name: string;

    orgTaskId: number;
    orgTaskScheduleId: number;
    userGroupId: number;
    notificationId: number;
    frequencyType: number;
    reminderValue: string;

    notificationName: string;
    notificationTypeName: string;
    orgTaskName: string;
    userGroupName: string;
    userGroupCategoryName: string;

    nextRunLog: NextScheduledRun;
    lastRunLog: NextScheduledRun;
    templates: Array<ReminderTemplate>;
    constructor(model: any = <any>{}) {
        super();
        const {
            id, name, orgTaskId, orgTaskScheduleId, userGroupId, notificationId, frequencyType, reminderValue,
            orgTaskName, notificationName, notificationTypeName, userGroupName, userGroupCategoryName,
            lastRunLog, nextRunLog, templates
        } = model;
        this.id = id;
        this.name = name;
        this.orgTaskId = orgTaskId;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.userGroupId = userGroupId;
        this.notificationId = notificationId;
        this.frequencyType = frequencyType;
        this.reminderValue = reminderValue;

        this.orgTaskName = orgTaskName;
        this.notificationName = notificationName;
        this.notificationTypeName = notificationTypeName;
        this.userGroupName = userGroupName;
        this.userGroupCategoryName = userGroupCategoryName;

        this.lastRunLog = lastRunLog ? new NextScheduledRun(lastRunLog): null;
        this.nextRunLog = nextRunLog ? new NextScheduledRun(nextRunLog): null;
        this.templates = (templates || []).map(r => new ReminderTemplate(r));
    }
}

export class TaskReminderSerializer {
    fromJson(json: any): TaskReminder { return new TaskReminder(json); }
    toJson(data: any): any {return data; }
}
