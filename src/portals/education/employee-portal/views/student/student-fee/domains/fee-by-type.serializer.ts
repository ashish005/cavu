import {FeeByCommon} from "./fee-by.common";

export class FeeByType extends FeeByCommon {
  feeTypeId: number;
  feeTypeName: string;
  totalStudents:number;

  amount: number;
  taxAmount: number;

  constructor(model: any = <any>{}){
      super(model);
      const {
          feeTypeId, feeTypeName, amount, taxAmount, count
      } = model;
      this.totalStudents = count;
      this.feeTypeId = feeTypeId;
      this.feeTypeName = feeTypeName;
      this.amount = amount;
      this.taxAmount = taxAmount;
  }
}

export class FeeByTypeSerializer {
  fromJson(json: any): FeeByType { return new FeeByType(json); }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}


