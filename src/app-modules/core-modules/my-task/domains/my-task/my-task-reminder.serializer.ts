import {CoreQueryOptions, CoreResource} from "@app-global";

export class MyTaskReminderQueryOptions extends CoreQueryOptions {
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

export class MyTaskReminder extends CoreResource
{
    override id: number;
    orgTaskScheduleId: number;
    userGroupId: number;
    notificationId: number;
    frequencyType: number;
    reminderValue: string;
    name: string;
    notificationName: string;
    notificationTypeName: string;
    orgTaskName: string;

    constructor(model: any = <any>{}) {
        super();
        const { id, name, orgTaskScheduleId, userGroupId, notificationId, frequencyType, reminderValue, orgTaskName, notificationName, notificationTypeName} = model;
        this.id = id;
        this.name = name;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.userGroupId = userGroupId;
        this.notificationId = notificationId;
        this.frequencyType = frequencyType;
        this.reminderValue = reminderValue;
        this.orgTaskName = orgTaskName;
        this.notificationName = notificationName;
        this.notificationTypeName = notificationTypeName;
    }
}

export class MyTaskReminderSerializer {
    fromJson(json: any): MyTaskReminder { return new MyTaskReminder(json); }
    toJson(data: any): any {return data; }
}
