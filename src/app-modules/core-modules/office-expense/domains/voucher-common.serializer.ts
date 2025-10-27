import { CoreResource } from "@app-global";

class Party {
    id: string;
    name: string;
    printName: string;
    creditDaysPurchase: number;
    creditDaysSale: number;
    creditLimit: number;
    openingBalance: number;
    constructor(model: any = <any>{}) {
        const {id, name, printName, creditDaysPurchase, creditDaysSale, creditLimit, openingBalance } = model;
        this.id = id;
        this.name = name;
        this.printName = printName;
        this.creditDaysPurchase = creditDaysPurchase;
        this.creditDaysSale = creditDaysSale;
        this.creditLimit = creditLimit;
        this.openingBalance = openingBalance;
    }
}

export class VoucherExpenseCommon extends CoreResource {
    voucherId: number;
    voucherNo: string;
    date: string;
    voucherMasterType: string;
    voucherType: string;
    voucherTypeId: number;
    isItemInvoice: boolean;
    isLocalSale: boolean;
    amount: number;

    party: Party;

    projectId: number;

    orderId: number;
    orderNo: string;
    orderDate: string;
    orderType: string;
    discountAmount: number;

    constructor(model: any = <any>{}){
        super();
        const {
            id, voucherId, voucherNo, date, voucherMasterType, voucherType, voucherTypeId, amount, isItemInvoice, isLocalSale,
            party,
            projectId,
            orderId, orderNo, orderDate, orderType, discountAmount
        } = model;
        this.voucherId = voucherId;
        this.voucherNo = voucherNo;
        this.date = date;
        this.voucherMasterType = voucherMasterType;
        this.voucherType = voucherType;
        this.voucherTypeId = voucherTypeId;
        this.amount = amount;
        this.isItemInvoice = isItemInvoice;
        this.isLocalSale = isLocalSale;

        this.projectId = projectId;
        this.party = new Party(party || {});

        this.orderId = orderId;
        this.orderNo = orderNo;
        this.orderDate = orderDate;
        this.orderType = orderType;
        this.discountAmount = discountAmount;
    }
}
