import {CoreQueryOptions} from "@app-global";

export class TaskPriorityQueryOptions extends CoreQueryOptions{}

export class TaskPriority {
  id: number;
  name: string;
  masterType: string;
  sortOrder: number;
  isDefault: number;
  color: string;

  isLocked: boolean;
  isActive: boolean;
  constructor(model: any = <any>{}){
    const { id, name, masterType, sortOrder, isDefault, color, isLocked, isActive} = model;
    this.id = id;
    this.name = name;
    this.masterType = masterType;
    this.sortOrder =  sortOrder;
    this.isDefault = isDefault;
    this.color = color;

    this.isLocked = isLocked;
    this.isActive = isActive;
  }
}

export class TaskPrioritySerializer {
  fromJson(json: any): TaskPriority { return new TaskPriority(json); }
  toJson(data: any): any { return data; }
}
