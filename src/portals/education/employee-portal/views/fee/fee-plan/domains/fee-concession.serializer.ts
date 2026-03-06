import { CoreQueryOptions, CALC_TYPE } from "@app-global";

export class FeeConcessionTypeQueryOptions extends CoreQueryOptions{}

export class FeeConcessionType {
  id: string;
  name: string;
  calculationType: number;
  calculationTypeName: string;
  calculationValue: number;
  remark: string;
  reservationCategoryId: number;
  reservationCategoryName: string;
  status: string;
  isLocked: boolean;

  get isFixedType(){ return (this.calculationType === CALC_TYPE.FIXED); }

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.calculationType = model.calculationType;
    this.calculationTypeName = model.calculationTypeName;
    this.calculationValue = model.calculationValue;
    this.remark = model.remark;
    this.reservationCategoryId = model.reservationCategoryId;
    this.reservationCategoryName = model.reservationCategoryName;
    this.status = model.status;
    this.isLocked = model.isLocked;
  }

  get calculationName() { return `${this.calculationValue} ${this.calculationType}`; }
}

export class FeeConcessionTypeSerializer {
  fromJson(json: any): FeeConcessionType {
    return new FeeConcessionType(json);
  }

  toJson(data: any): any { return data; }
}
