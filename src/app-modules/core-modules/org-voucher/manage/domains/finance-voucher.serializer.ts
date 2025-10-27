import {CoreResource, DateHelper, SchedularDomain, UtilHelper} from "@app-global";
import {VOUCHER_TYPES} from "@app-base/enums/voucher-type";
import {Validators} from "@angular/forms";

class Product {
    voucherId: number;
    taxCode: string;
    taxRate: number;
    taxId: number;
    taxMapperId: number;
    trxnId: number;

    isFixedPrice: boolean;
    discount:number;
    discountRate:number;
    mrp: number;

    price: number;
    productId: string;
    productTypeId: string;
    variantId: number;
    variantName: string;
    baseUnitTypeId: number;
    quantity: number;
    taxAmount: number;
    isTaxInclusive: boolean;
    taxes: Array<any>;

    constructor(model: any = <any>{}){
        const {
            voucherId, taxRate, taxCode, taxId, taxMapperId, trxnId,
            isFixedPrice, discount, discountRate,
            mrp,
            price, productId, productTypeId, variantId, variantName, baseUnitTypeId, quantity, isTaxInclusive, taxes,
            taxAmount
        } = model;
        this.voucherId = voucherId;
        this.taxRate = taxRate;
        this.taxCode = taxCode;
        this.taxId = taxId;
        this.taxMapperId = taxMapperId;
        this.trxnId = trxnId;

        this.isFixedPrice = isFixedPrice;
        this.discount = discount;
        this.discountRate = discountRate;

        this.mrp = mrp;

        this.price = price;
        this.productId = productId;
        this.productTypeId = productTypeId;
        this.variantId = variantId;
        this.variantName = variantName;
        this.baseUnitTypeId = baseUnitTypeId;
        this.quantity = quantity;
        this.isTaxInclusive = isTaxInclusive;
        this.taxes = taxes;
        this.taxAmount = taxAmount;
        //this.taxAmount = this.calculateVoucherTotalAmount(this.price, this.quantity, taxes).taxAmount;
        /*this.accountGroupId = model.accountGroupId;
        this.date = model.date;
        this.credit = model.credit;
        this.debit = model.debit;
        this.entryBy = model.entryBy;
        this.entryDate = model.entryDate;
        this.remark = model.remark;
        this.bankDate = model.bankDate;
        this.isVoucher = model.isVoucher;
        this.isParty = model.isParty;
        this.refNo = model.refNo;
        this.refDate = model.refDate;
        this.refVoucherId = model.refVoucherId;
        this.refVoucherTypeId = model.refVoucherTypeId;
        this.balance = model.balance;*/
    }

    calculateVoucherTotalAmount(amt, qty, taxes){
        const totalAmount = (amt * qty);
        const total = (taxes || []).reduce((result, curr)=> {
            const rate = parseFloat(curr.rate || 0);
            result.taxAmount += parseFloat(curr.amount || 0);
            result.total += totalAmount + ((totalAmount * rate)/100);
            return result;
        }, { taxAmount: 0, total: 0 });

        if(!(taxes||[]).length){
            return { taxAmount: 0, total: totalAmount};
        }
        return total;
    }
}

export class VoucherItem {
    id: number | string;
    name: string;
    desc: string;
    remark: string;
    accountId: string;
    accountGroupId: number;
    isPrimary: boolean;

    netAmount: number;
    foreignAmount: number;

    product: Product;
    constructor(model: any = <any>{}){
        const { id, name, desc, isPrimary, remark, accountId,  accountGroupId, netAmount, foreignAmount, product } = model;
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.remark = remark;
        this.isPrimary = isPrimary;

        this.accountId = accountId;
        this.accountGroupId = accountGroupId;

        this.netAmount = netAmount;
        this.foreignAmount = foreignAmount;
        this.product = new Product(product);
    }

    calculateVoucherTotalAmount=(amt, qty, taxes)=> this.product.calculateVoucherTotalAmount(amt, qty, taxes);
}

export class SundryDetail {
    name: string;
    accountId: string;
    isItemInvoice: boolean;
    transactionId: number;
    transactionTypeId:number;
    transactionDate: string;

    voucherId: number;
    voucherNo: string;
    voucherTypeId: number;
    voucherType: string;
    voucherMasterType: string;
    voucherDate: string;

    sundryTypeId: number;
    accountGroupId: number;
    amount: number;
    taxRate: number;
    hasTax: boolean;
    taxTypeRateId: number;
    hasVoucherCredit: boolean;

    sundryAccountMasterType: string;

    constructor(model: any = <any>{}){
        const {name, accountId, accountGroupId, isItemInvoice,
            transactionId, transactionTypeId, transactionDate,
            voucherId, voucherNo, voucherTypeId, voucherType, voucherDate, voucherMasterType,
            sundryTypeId, amount, taxRate, hasTax, taxTypeRateId, hasVoucherCredit,
            sundryAccountMasterType
        } = model;
        this.name = name;
        this.accountId = accountId;
        this.isItemInvoice = isItemInvoice;

        this.transactionId = transactionId;
        this.transactionTypeId = transactionTypeId;
        this.transactionDate = transactionDate;

        this.voucherId = voucherId;
        this.voucherNo = voucherNo;
        this.voucherTypeId = voucherTypeId;
        this.voucherType = voucherType;
        this.voucherDate = voucherDate;
        this.voucherMasterType = voucherMasterType;

        this.sundryTypeId = sundryTypeId;
        this.accountGroupId = accountGroupId;
        this.amount = amount;
        this.taxRate = taxRate;
        this.hasTax = hasTax;
        this.taxTypeRateId = taxTypeRateId;
        this.hasVoucherCredit = hasVoucherCredit;
        this.sundryAccountMasterType = sundryAccountMasterType;
    }
}

export class PaymentTransaction {
    gatewayMapperId: string;
    modeId: number;
    cardTypeId: number;
    referenceNo: string;

    gatewayAccountId: string;
    gatewayAccountGroupId: number;
    paymentSystemMaster: string;

    amount: number;
    balance: number;
    foreignAmount: number; // set from voucher

    constructor(data: any = <any>{}){
        const { modeId, gatewayMapperId, cardTypeId, gatewayAccountId, gatewayAccountGroupId, referenceNo, amount, balance, paymentSystemMaster } = data;
        this.gatewayMapperId = gatewayMapperId;
        this.modeId = modeId;

        this.cardTypeId =  cardTypeId;
        this.referenceNo =  referenceNo;

        this.gatewayAccountId =  gatewayAccountId;
        this.gatewayAccountGroupId = gatewayAccountGroupId;
        this.paymentSystemMaster = paymentSystemMaster;

        this.amount = amount;
        this.balance = balance;
    }
}

export class BillToBillTrxn {
    id: string;
    dueAmount: number;
    trxnAmount: number;
    voucherId: number;
    voucherTypeId: string;

    constructor(data: any = <any>{}){
        const {id, dueAmount, trxnAmount, voucherId, voucherTypeId } = data;
        this.id = id;
        this.dueAmount = dueAmount;
        this.trxnAmount =  trxnAmount;
        this.voucherId = voucherId;
        this.voucherTypeId =  voucherTypeId;
    }
}

export class VoucherOrg{
    name: string;
    websiteUrl: string;
    address: string;
    country: string;
    emailId1: string;
    contactNo1: string;

    constructor(data: any = <any>{}){
        const {name, websiteUrl, address, country, emailId1, contactNo1 } = data;
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.address =  address;
        this.country = country;
        this.emailId1 =  emailId1;
        this.contactNo1 =  contactNo1;
    }
}

export class FinanceVoucher extends CoreResource {
    isItemInvoice: boolean;
    enableAccounting: boolean; // ui to show
    enableInventory: boolean; // ui to show

    partyAccountId: string;
    partyAccountGroupId: number;
    partyUserId: string;
    partyName: string;

    voucherNo: string;
    voucherDate: string;
    voucherMasterType: string;

    currencyId: number;
    currencyRate: number;

    currencyCode: string;// ui to show
    currencySymbol: string;// ui to show
    systemCurrencyCode: string;// ui to show

    notes: string;
    remark: string;

    inDraft: boolean;
    subTypeId: number;

    // partyName: string;
    //
    // clientId: string;
    // projectId: string;
    // moduleId: number;
    //
    // subTotal: number;
    // discount: number;
    // taxAmount: number;
    // amount: number;
    // dueAmount: number;
    //
    // netAmount: number;
    // remainingPayment: number;
    //
    // status: string;
    //
    // name: string;
    //
    //
    // accountId: string;
    // accountGroupId: any;
    //
    //
    //
    // defaultAccountId: string;
    // defaultAccountGroupId: number;
    //
    // trxnId: number;
    // trxnTypeId:number;
    // trxnDate: string;
    // trxnTypeName: string;
    //
    // partyRefNo: string;
    // partyRefDate: string;
    //
    // refVoucherId: number;
    // refVoucherNo: string;
    // refVoucherTypeId: number;
    //
    // currencyId: number;
    // currencyRate: number;
    // currencyCode: string;// ui to show
    // currencySymbol: string;// ui to show
    // systemCurrencyCode: string;// ui to show
    //
    // isRecurringVoucher: boolean;
    // scheduleId: number;
    // trxnScheduleId: number;
    // //orderId: [null],
    // acquisitionId: number;
    // supplyStateId: number;
    //
    // packingCharge: number;
    // deliveryCharge: number;
    // roundingMethodId: number;
    // rounding: any;
    //
    // partyAccountGroupMaster: string;// find customer or vendor or  employee

    //systemCurrencyCode:string; //for ui controlling
    //org: VoucherOrg;
    items: Array<VoucherItem>;
    billToBillTrxn: Array<BillToBillTrxn>;
    sundryDetails: Array<SundryDetail>;
    trxn: PaymentTransaction;
    //schedule: SchedularDomain;
    constructor(model: any = <any>{}){
        super();
        const {
            isItemInvoice, enableAccounting, enableInventory,
            partyAccountId, partyAccountGroupId, partyName, partyUserId,
            voucherNo, voucherDate, voucherMasterType,
            currencyId, currencyRate, currencyCode, currencySymbol, systemCurrencyCode,
            inDraft, subTypeId, notes, remark
        } = model;

        const { items, billToBillTrxn, sundryDetails, trxn } = model;
        /*const {
            partyName, partyUserId, partyAccountId, accountGroupId, defaultAccountId, defaultAccountGroupId,
            isItemInvoice,
            trxnId, trxnTypeId, trxnDate, trxnTypeName,
            voucherId, voucherNo, voucherTypeId, voucherType, voucherDate, voucherMasterType,
            partyRefNo, partyRefDate,
            refVoucherId, refVoucherNo, refVoucherTypeId,
            subTotal, discount, taxAmount, amount, dueAmount, projectId, moduleId, enableAccounting, enableInventory,
            currencyId, currencyRate, currencyCode, currencySymbol, systemCurrencyCode,

            isRecurringVoucher, scheduleId, trxnScheduleId, acquisitionId, supplyStateId,
            packingCharge, deliveryCharge, roundingMethodId, rounding, inDraft,
            partyAccountGroupMaster,
            notes, remark
        } = model;*/

        this.isItemInvoice = isItemInvoice || false;
        // this.enableAccounting = ;// ui to show
        // this.enableInventory = ;// ui to show
        this.partyName = partyName;
        this.partyUserId = partyUserId;
        this.partyAccountId = partyAccountId;
        this.partyAccountGroupId = partyAccountGroupId;

        this.voucherNo = voucherNo;
        this.voucherDate = DateHelper.toDateControlFormat(voucherDate);
        this.voucherMasterType = voucherMasterType || VOUCHER_TYPES.SALE;

        this.currencyId = currencyId;
        this.currencyRate = currencyRate || 1;
        this.currencyCode = currencyCode;
        this.currencySymbol = currencySymbol;// ui to show
        this.systemCurrencyCode = systemCurrencyCode;

        this.inDraft = inDraft;
        this.notes = notes;
        this.remark = remark;

        this.subTypeId = subTypeId || null;

        // this.trxnId = trxnId;
        // this.trxnTypeId = trxnTypeId;
        // this.trxnDate = trxnDate;
        // this.trxnTypeName = trxnTypeName;
        //
        // this.voucherId = voucherId;
        //
        //
        // this.projectId = projectId;
        // this.moduleId = moduleId;
        //
        // this.partyRefNo = partyRefNo;
        // this.partyRefDate = DateHelper.toDateControlFormat(partyRefDate);
        //
        // this.refVoucherId = refVoucherId;
        // this.refVoucherNo = refVoucherNo;
        // this.refVoucherTypeId = refVoucherTypeId;
        //
        // this.subTotal = subTotal;
        // this.discount = discount;
        // this.taxAmount = taxAmount;
        // this.amount = amount;
        // this.dueAmount = dueAmount;
        //
        // this.isRecurringVoucher = isRecurringVoucher;
        // this.scheduleId = scheduleId;
        // this.trxnScheduleId = trxnScheduleId;
        // this.acquisitionId = acquisitionId;
        // this.supplyStateId = supplyStateId;
        // this.packingCharge = packingCharge;
        // this.deliveryCharge = deliveryCharge;
        //
        // this.roundingMethodId = roundingMethodId;
        // this.rounding = rounding;
        // this.partyAccountGroupMaster = partyAccountGroupMaster;

        this.items = (items || []).map(r => new VoucherItem(r));
        this.billToBillTrxn = (billToBillTrxn || []).map(r => new BillToBillTrxn(r));
        this.sundryDetails = (sundryDetails || []).map(r => new SundryDetail(r));
        this.trxn = new PaymentTransaction(trxn);

        const remaining = this.getPendingBalance();
        this.trxn.amount = remaining;
        this.trxn.foreignAmount = remaining/this.currencyRate;
    }

    public getPendingBalance()
    {
        return this.trxn.balance || 0 - (this.billToBillTrxn || []).reduce(function(result, curr) { return result + curr.trxnAmount; }, 0);
    }
}

export class FinanceVoucherSerializer {
    fromJson(json: any): FinanceVoucher {
        return new FinanceVoucher(json);
    }

    toJson(data: any): any { return data;
        /*const v = new FinanceVoucher();
        v.voucher = new Voucher(data);

        v.trxn = data.trxn;
        v.billToBillTrxn  = data.billToBillTrxn;
        v.sundryDetails = data.sundryDetails;
        v.items = data.items;
        v.schedule = data.schedule;
        return v;*/
    }
}
