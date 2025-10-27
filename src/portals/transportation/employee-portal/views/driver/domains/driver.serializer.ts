import {CoreQueryOptions, CoreResource} from "@app-global";

export class DriverQueryOptions extends CoreQueryOptions{
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

export class Driver extends CoreResource
{
    name: string;
    fName: string;
    lName: string;
    email: string;
    phone: string;
    dob: string;

    dlNumber: string;
    dlValidity: string;
    dlDocumentId: number;

    experience: string;
    insuranceValidity: string;
    joiningDate: string;
    userId: string;
    licenseTypeId: number;
    shiftId: number;

    planId: number;
    dLDocumentId: number;

    planName: string;
    licenseTypeName: string;
    shiftName:string;

    constructor(model: any = <any>{}){
        super();
        const {
            id, userId, name, fName, lName, email, phone, dob,
            planId, planName, dlNumber, dlValidity, dlDocumentId, experience, insuranceValidity, joiningDate,
            licenseTypeId, licenseTypeName, dLDocumentId,
            shiftId, shiftName
        } = model;
        this.id = id;
        this.userId = userId;

        this.name = name;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.phone = phone;
        this.dob = dob;

        this.dlNumber = dlNumber;
        this.dlValidity = dlValidity;
        this.dlDocumentId = dlDocumentId;
        this.experience =  experience;
        this.insuranceValidity = insuranceValidity;
        this.joiningDate = joiningDate;

        this.planId = planId;
        this.licenseTypeId = licenseTypeId;
        this.shiftId = shiftId;
        this.dLDocumentId = dLDocumentId;

        this.planName = planName;
        this.licenseTypeName = licenseTypeName;
        this.shiftName = shiftName;
    }
}

export class DriverSerializer {
  fromJson(json: any): Driver { return new Driver(json); }
  toJson(model: any): any {return model;}
}
