import {CoreResource} from "@app-global";

export class InventoryLookup extends CoreResource{

  constructor(model: any = <any>{}){
    super();
    const { } = model;
  }
}

export class InventoryLookupSerializer {
  fromJson(json: any): InventoryLookup { return new InventoryLookup(json); }

  toJson(data: any): any {
    return {};
  }
}
