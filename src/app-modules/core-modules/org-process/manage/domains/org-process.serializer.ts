import {CoreQueryOptions, CoreResource} from "@app-global";

export class OrgProcessQueryOptions extends CoreQueryOptions{
    parentId: number | string;

    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            parentId:this.parentId
        };
        return super.getParamByObject(obj);
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
  constructor(model: any = <any>{}){
    super();
      const {
          id, name, description, sortOrder,
          parentId, parentName,
          //processPhase, processPhaseOn, manualStatus, manualStatusOn,
          inchargeId, inchargeName, processStatus,
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
  }
}

export class OrgProcessSerializer {
  fromJson(json: any): OrgProcess {
    return new OrgProcess(json);
  }

  toJson(data: any): any { return data; }
}
