import {CoreQueryOptions, CoreResource} from "@app-global";
export class OrgProcessQueryOptions extends CoreQueryOptions{
    parentId: number | string;
    constructor(model: any = {}){ super(model); }
    override toQueryString (){
        const obj = {
            parentId:this.parentId
        };
        return super.getParamByObject(obj);
    }
}

class ApprovalSteps {
    id: number;
    name: string;
    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, sortOrder, isActive
        } = model;

        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}
class OrgProcessPhase{
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    phaseStatusId: number;
    phaseStatusName: string;
    color: string;
    isActive: boolean;
    approvalSteps: Array<ApprovalSteps>;
    constructor(model: any = <any>{}){
        const {
            id, name, description, sortOrder, isDefault, color,
            phaseStatusId, phaseStatusName, approvalSteps,
            isActive
        } = model;

        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.phaseStatusId = phaseStatusId;
        this.phaseStatusName = phaseStatusName;
        this.color = color;
        this.isActive = isActive;
        this.approvalSteps = (approvalSteps || []).map(r => new ApprovalSteps(r));
    }
}
export class OrgProcess extends CoreResource {
    name: string;
    description: string;
    sortOrder: string;
    parentId: number;
    parentName: string;
    // processPhase: string;
    // processPhaseOn: string;
    // manualStatus: string;
    // manualStatusOn: string;
    inchargeId: number;
    inchargeName: string;
    processStatus: string;
    isLocked: boolean;
    isActive: boolean;
    phases: Array<OrgProcessPhase>;
  constructor(model: any = <any>{}){
    super();
      const {
          id, name, description, sortOrder,
          parentId, parentName,
          //processPhase, processPhaseOn, manualStatus, manualStatusOn,
          inchargeId, inchargeName, processStatus, phases,
          isLocked, isActive
      } = model;
      this.id = id;
      this.name = name;
      this.description = description;
      this.sortOrder = sortOrder;
      this.parentId = parentId;
      this.parentName = parentName;
      // this.processPhase = processPhase;
      // this.processPhaseOn = processPhaseOn;
      // this.manualStatus = manualStatus;
      // this.manualStatusOn = manualStatusOn;
      this.inchargeId = inchargeId;
      this.inchargeName = inchargeName;
      this.processStatus = processStatus;
      this.isLocked = isLocked;
      this.isActive = isActive;
      this.phases = (phases || []).map(r => new OrgProcessPhase(r));
  }
}
export class OrgProcessSerializer {
  fromJson(json: any): OrgProcess { return new OrgProcess(json); }
  toJson(data: any): any { return data; }
}
