import {CoreResource} from "@app-global";


export class FeeChallanSummary {
    dueMonth: number;
    dueYear: number;
    advance: number;
    balance: number;
    dueFee: number;
    paid: number;
    totalFee: number;
    name: string;

    constructor(model: any = {}){
        const { dueMonth, dueYear, advance, balance, dueFee, paid, totalFee, name } = model;
        this.dueMonth = dueMonth;
        this.dueYear = dueYear;
        this.advance = advance || 0;
        this.balance = balance || 0;
        this.dueFee = dueFee || 0;
        this.paid = paid || 0;
        this.totalFee = totalFee || 0;
        this.name = name;
    }
}

export class FeeByCommon extends CoreResource {
    challanSummary: FeeChallanSummary;
    challanStructure: Array<FeeChallanSummary>;
    constructor(model: any = <any>{}){
        super();
        const { challanSummary, challanStructure } = model;
        this.challanSummary = new FeeChallanSummary(challanSummary || {});
        this.challanStructure = (challanStructure || []).map(r => new FeeChallanSummary(r));
    }

    get advance(){ return this.challanSummary.advance; }
    get balance(){ return this.challanSummary.balance; }
    get dueFee(){ return this.challanSummary.dueFee; }
    get paid(){ return this.challanSummary.paid; }
    get totalFee(){ return this.challanSummary.totalFee; }
    get dueDate(){ return this.challanSummary.name; }
}


