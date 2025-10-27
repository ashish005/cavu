// import {CoreResource} from "@app-core";
//
// export class TaskUserGroup {
//   id: string;
//   name: string;
//   userGroupTypeId: number;
//
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.userGroupTypeId = model.userGroupTypeId;
//   }
// }
//
// export class TaskUserGroupCategory {
//   id: string;
//   name: string;
//   userGroups: Array<TaskUserGroup>;
//
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.userGroups = (model.userGroups || []).map(r => new TaskUserGroup(r));
//   }
// }
//
// export class TaskNotificationType {
//   id: string;
//   name: string;
//   masterType: string;
//   userTypeId: number;
//
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.masterType = model.masterType;
//     this.userTypeId = model.userTypeId;
//   }
// }
//
// class NotificationUserType {
//   id: string;
//   name: string;
//   masterType: string;
//
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.masterType = model.masterType;
//   }
// }
//
// export class TemplateMediaType {
//   id: string;
//   name: string;
//   masterType: string;
//   sortOrder: number;
//
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.masterType = model.masterType;
//     this.sortOrder = model.sortOrder;
//   }
// }
//
// class TaskType {
//   id: string;
//   name: string;
//   masterType: string;
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.masterType = model.masterType;
//   }
// }
//
// class OrgProcess {
//   id: number | string;
//   name: string;
//   masterType: string;
//   parentId: number;
//   sortOrder: number;
//   subProcess:  Array<OrgProcess>;
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//     this.masterType = model.masterType;
//     this.parentId = model.parentId;
//     this.sortOrder = model.sortOrder;
//     this.subProcess = (model.subProcess || []).map(r => new OrgProcess(r));
//   }
// }
//
// class FrequencyType {
//   id: string;
//   name: string;
//   constructor(model: any = <any>{}){
//     this.id = model.id;
//     this.name = model.name;
//   }
// }
//
// export class OrgTaskLookup extends CoreResource{
//   taskType: Array<TaskType> = [];
//   orgProcess: Array<OrgProcess> = [];
//   frequencyType: Array<FrequencyType> = [];
//   mediaType: Array<TemplateMediaType> = [];
//   userType: Array<NotificationUserType> = [];
//   notificationType: Array<TaskNotificationType> = [];
//   userGroupCategory: Array<TaskUserGroupCategory> = [];
//   userGroups: Array<TaskUserGroup> = [];
//
//
//   orgProcessMapping: any;
//
//   constructor(model: any = <any>{}){
//     super();
//     this.taskType = (model.taskType || []).map(r => new TaskType(r));
//     this.orgProcess = (model.orgProcess || []).map(r => new OrgProcess(r));
//     this.frequencyType = (model.frequencyType || []).map(r => new FrequencyType(r));
//     this.mediaType = (model.mediaType || []).map(r => new TemplateMediaType(r));
//     this.userType = (model.userType || []).map(r => new NotificationUserType(r));
//     this.notificationType = (model.notificationType || []).map(r => new TaskNotificationType(r));
//     this.userGroupCategory = (model.userGroupCategory || []).map(r => new TaskUserGroupCategory(r));
//
//     this.userGroups = (this.userGroupCategory).reduce((result, curr)=>{
//       result = result.concat(...curr.userGroups);
//       return result;
//     }, []);
//
//     const redueProcess = (result, curr)=>{
//       result[curr.id] = { id: curr.id, parentId: curr.parentId };
//       (curr.subProcess || []).reduce(redueProcess, result);
//       return result;
//     };
//     this.orgProcessMapping = this.orgProcess.reduce(redueProcess, {});
//   }
//
//   getAdministrativeTask(){
//     return this.taskType.find(r => r.masterType == 'administrative');
//   }
//
//   getParentOrgProcessById(processId: number): Array<OrgProcess>{
//     return (this.orgProcess.find(r  => r.id == processId) || <OrgProcess>{}).subProcess;
//   }
// }
//
// export class OrgMyTaskLookup extends CoreResource{
//     taskType: Array<TaskType> = [];
//     orgProcess: Array<OrgProcess> = [];
//     frequencyType: Array<FrequencyType> = [];
//     mediaType: Array<TemplateMediaType> = [];
//     userType: Array<NotificationUserType> = [];
//     notificationType: Array<TaskNotificationType> = [];
//     userGroupCategory: Array<TaskUserGroupCategory> = [];
//     userGroups: Array<TaskUserGroup> = [];
//
//
//     orgProcessMapping: any;
//
//     constructor(model: any = <any>{}){
//         super();
//         this.taskType = (model.taskType || []).map(r => new TaskType(r));
//         this.orgProcess = (model.orgProcess || []).map(r => new OrgProcess(r));
//         this.frequencyType = (model.frequencyType || []).map(r => new FrequencyType(r));
//         this.mediaType = (model.mediaType || []).map(r => new TemplateMediaType(r));
//         this.userType = (model.userType || []).map(r => new NotificationUserType(r));
//         this.notificationType = (model.notificationType || []).map(r => new TaskNotificationType(r));
//         this.userGroupCategory = (model.userGroupCategory || []).map(r => new TaskUserGroupCategory(r));
//
//         this.userGroups = (this.userGroupCategory).reduce((result, curr)=>{
//             result = result.concat(...curr.userGroups);
//             return result;
//         }, []);
//
//         const redueProcess = (result, curr)=>{
//             result[curr.id] = { id: curr.id, parentId: curr.parentId };
//             (curr.subProcess || []).reduce(redueProcess, result);
//             return result;
//         };
//         this.orgProcessMapping = this.orgProcess.reduce(redueProcess, {});
//     }
//
//     getAdministrativeTask(){
//         return this.taskType.find(r => r.masterType == 'administrative');
//     }
//
//     getParentOrgProcessById(processId: number): Array<OrgProcess>{
//         return (this.orgProcess.find(r  => r.id == processId) || <OrgProcess>{}).subProcess;
//     }
//
//     getProjectOrgProcess(): OrgProcess {
//         return this.orgProcess.find(r  => r.masterType == 'project_management');
//     }
// }
//
// export class OrgTaskLookupSerializer {
//     fromJson(json: any): OrgTaskLookup { return new OrgTaskLookup(json); }
//     toJson(data: any): any { return {}; }
// }
//
// export class OrgMyTaskLookupSerializer {
//     fromJson(json: any): OrgMyTaskLookup { return new OrgMyTaskLookup(json); }
//     toJson(data: any): any { return {}; }
// }
