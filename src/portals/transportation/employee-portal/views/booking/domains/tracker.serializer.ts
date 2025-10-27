import {CoreQueryOptions, CoreResource} from "@app-global";

export class TrackerQueryOptions extends CoreQueryOptions{
    code: string;
    constructor(data: any = {}){
        super(data);
        this.code = data.code;
    }

    override toQueryString (){
        const obj = {
            code:this.code
        };
        return super.getParamByObject(obj);
    }
}

export class Tracker extends CoreResource
{
    driverId: number;
    vehicleId: number;
    operatorId: number;
    measurementId: number;
    fromDate: string;
    tillDate: string;

    fromMeterReading: string;
    tillMeterReading: string;
    travelDistance: string;
    measurementValue: string;

    driverDLNumber: string;
    driverName: string;

    vehicleNo: string;
    vehicleModel: string;
    vehicleTypeName: string;
    vehicleManufactureName: string;
    operatorName: string;
    receipt: string;
    balance: string;
    constructor(model: any = <any>{}){
        super();
        const {
            id,
            driverId, vehicleId, operatorId, measurementId, fromDate, tillDate,
            fromMeterReading, tillMeterReading, travelDistance, measurementValue,
            driverDLNumber, driverName, vehicleNo, vehicleModel, vehicleTypeName, vehicleManufactureName,operatorName,
            receipt, balance
        } = model;
        this.id = id;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.operatorId = operatorId;
        this.measurementId = measurementId;
        this.fromDate = fromDate;
        this.tillDate = tillDate;

        this.fromMeterReading = fromMeterReading;
        this.tillMeterReading = tillMeterReading;
        this.travelDistance = travelDistance;
        this.measurementValue = measurementValue;

        this.driverDLNumber = driverDLNumber;
        this.driverName = driverName;
        this.vehicleNo = vehicleNo;
        this.vehicleModel = vehicleModel;
        this.vehicleTypeName = vehicleTypeName;
        this.vehicleManufactureName = vehicleManufactureName;
        this.operatorName = operatorName;

        this.receipt = receipt;
        this.balance = balance;
    }
}

export class TrackerSerializer {
  fromJson(json: any): Tracker { return new Tracker(json); }
  toJson(model: any): any {return model;}
}
