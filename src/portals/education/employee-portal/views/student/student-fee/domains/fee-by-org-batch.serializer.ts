import {FeeByCommon} from "./fee-by.common";

export class FeeByOrgBatch extends FeeByCommon {
    //id: number;
    name: string;
    totalStudents:number;

    constructor(model: any = <any>{}){
        super(model);
        const {
            totalStudents, id, name
        } = model;
        this.totalStudents = totalStudents;
        this.id = id;
        this.name = name;
    }
}

export class FeeByOrgBatchSerializer {
  fromJson(json: any): FeeByOrgBatch { return new FeeByOrgBatch(json); }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}


