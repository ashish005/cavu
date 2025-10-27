import {CoreQueryOptions} from "@app-global";

export class PaymentSystemTypeQueryOptions extends CoreQueryOptions{
    startDate: string;
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {
            startDate: this.startDate
        };
        return super.getParamByObject(obj);
    }
}
class PaymenGateway {
    id: string;
    name: string;
    description: string;
    constructor(model: any = <any>{}) {
        const {id, name, description} = model;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
class ModeType {
    id: string;
    name: string;
    description: string;
    constructor(model: any = <any>{}) {
        const {id, name, description} = model;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
class InstrumentType {
    id: string;
    name: string;
    items: Array<ModeType>;
    constructor(model: any = <any>{}) {
        const {id, name, items} = model;
        this.id = id;
        this.name = name;
        this.items = (items || []).map(r => new ModeType(r));
    }
}

export class PaymentSystemType {
    id: string;
    name: string;
    isPOS: boolean;
    isMobileWallet: boolean;
    isAPI: boolean;
    hasOptionalRefNo: boolean;
    isLocked: boolean;
    status: string;
    modes: Array<InstrumentType>;
    gateways: Array<PaymenGateway>;

    constructor(model: any = <any>{}){
        const { id, name, isPOS, isMobileWallet, isAPI, hasOptionalRefNo, isLocked, status, modes, gateways}  = model;
        this.id = id;
        this.name = name;
        this.isPOS = isPOS;
        this.isMobileWallet = isMobileWallet;
        this.isAPI = isAPI;
        this.hasOptionalRefNo = hasOptionalRefNo;
        this.isLocked = isLocked;
        this.status = status;
        this.modes = (modes || []).map(r => new InstrumentType(r));
        this.gateways = (gateways || []).map(r => new PaymenGateway(r));
    }
}


export class PaymentSystemTypeSerializer {
    fromJson(json: any): PaymentSystemType { return new PaymentSystemType(json); }
    toJson(data: any): any { return data; }
}
