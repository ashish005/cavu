import {CoreQueryOptions} from "@app-global";
export class InstrumentCountryQueryOptions extends CoreQueryOptions {
    instrumentId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            instrumentId: this.instrumentId
        };
        return super.getParamByObject(obj);
    }
}

export class InstrumentCountry {
    id: number;
    paymentModeId: number;
    bankInstrumentTypeId: number;
    paymentModeName: string;
    instrumentTypeName: string;
    isRequired: boolean;
    isPrimary: boolean;
    constructor(model: any = <any>{}){
        const {
            id, paymentModeId, bankInstrumentTypeId,
            paymentModeName, instrumentTypeName, isRequired, isPrimary
        }  = model;
        this.id = id;
        this.paymentModeId = paymentModeId;
        this.bankInstrumentTypeId = bankInstrumentTypeId;
        this.paymentModeName = paymentModeName;
        this.instrumentTypeName = instrumentTypeName;
        this.isRequired = isRequired;
        this.isPrimary = isPrimary;
    }
}

export class InstrumentCountrySerializer {
    fromJson(json: any): InstrumentCountry { return new InstrumentCountry(json); }
    toJson(data: any): any { return data; }
}
