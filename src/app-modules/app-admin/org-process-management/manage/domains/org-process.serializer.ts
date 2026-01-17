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

export class OrgProcess extends CoreResource {
    name: string;
    entityId: string;
    entityName: string;
    eventMasterType: string;
    phaseOn: string;
    phaseStepOn: string;
    processPhase: string;
    processPhaseStep: string;
    processStatus: string;
    inchargeId: number;
    inchargeName: string;
    isLocked: boolean;
    isActive: boolean;
  constructor(model: any = <any>{}){
    super();
      const {
          id, name,
          entityId, entityName, eventMasterType,
          phaseOn, phaseStepOn, processPhase, processPhaseStep,
          //processPhase, processPhaseOn, manualStatus, manualStatusOn,
          inchargeId, inchargeName, processStatus, phases,
          isLocked, isActive
      } = model;
      this.id = id;
      this.name = name;
      this.entityId = entityId;
      this.entityName = entityName;
      this.eventMasterType = eventMasterType;

      this.phaseOn = phaseOn;
      this.phaseStepOn = phaseStepOn;
      this.processPhase = processPhase;
      this.processPhaseStep = processPhaseStep;

      this.inchargeId = inchargeId;
      this.inchargeName = inchargeName;
      this.processStatus = processStatus;
      this.isLocked = isLocked;
      this.isActive = isActive;
  }
}
export class OrgProcessSerializer {
  fromJson(json: any): OrgProcess { return new OrgProcess(json); }
  toJson(data: any): any { return data; }
}
