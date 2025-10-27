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
    parentId: number;
    sortOrder: string;
    parentName: string;

    // processPhase: string;
    // processPhaseOn: string;
    // manualStatus: string;
    // manualStatusOn: string;

    inchargeId: number;
    inchargeName: string;

    totalSubProcesses: number;
    totalTaskCount: number;

    isRoot: boolean;
    isLocked: boolean;
    status: string;
    phaseCount: number;
  constructor(model: any = <any>{}){
    super();
      const {id, name, description, parentId, sortOrder, parentName,
          processPhase, processPhaseOn, manualStatus, manualStatusOn,
          inchargeId, inchargeName, isRoot, totalSubProcesses, totalTaskCount,
          isLocked, status, phaseCount
      } = model;
      this.id = id;
      this.name = name;
      this.description = description;

      this.parentId = parentId;
      this.parentName = parentName;
      this.sortOrder = sortOrder;

      // this.processPhase = processPhase;
      // this.processPhaseOn = processPhaseOn;
      // this.manualStatus = manualStatus;
      // this.manualStatusOn = manualStatusOn;
      this.inchargeId = inchargeId;
      this.inchargeName = inchargeName;

      this.isRoot = isRoot;
      this.totalSubProcesses = totalSubProcesses;
      this.totalTaskCount = totalTaskCount;

      this.isLocked = isLocked;
      this.status = status;
      this.phaseCount = phaseCount;
  }
}

export class OrgProcessSerializer {
  fromJson(json: any): OrgProcess {
    return new OrgProcess(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name,
      parentId: data.parentId,
      description: data.description
    };
  }
}
