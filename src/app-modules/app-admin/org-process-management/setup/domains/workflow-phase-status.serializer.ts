import {CoreQueryOptions} from "@app-global";

export class WorkflowPhaseStatusQueryOptions extends CoreQueryOptions{}

export class WorkflowPhaseStatus {
  id: number;
  name: string;
  description: string;
  masterType: string;
  sortOrder: number;
  isDefault: number;
  color: string;

  isLocked: boolean;
  isActive: boolean;
  constructor(model: any = <any>{}){
    const { id, name, masterType, description, sortOrder, isDefault, color, isLocked, isActive} = model;
    this.id = id;
    this.name = name;
    this.description = description;
    this.masterType = masterType;
    this.sortOrder =  sortOrder;
    this.isDefault = isDefault;
    this.color = color;

    this.isLocked = isLocked;
    this.isActive = isActive;
  }
}

export class WorkflowPhaseStatusSerializer {
  fromJson(json: any): WorkflowPhaseStatus { return new WorkflowPhaseStatus(json); }
  toJson(data: any): any { return data; }
}
