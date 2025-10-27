import {CoreQueryOptions, CoreResource, DateHelper} from "@app-global";

export class ProductTransactionQueryOptions extends CoreQueryOptions
{
    productId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
          productId: this.productId
        };
        return super.getParamByObject(obj);
    }
}

export class VoucherItem {
    id: number | string;
    name: string;
    desc: string;
    remark: string;
    partyUserId: string;
    accountId: string;
    accountGroupId: number;// used for particulars

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
    netAmount: number;
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
            id, name, desc, remark, partyUserId, accountId,  accountGroupId,
            voucherId, taxRate, taxCode, taxId, taxMapperId, trxnId,
            isFixedPrice, discount, discountRate,
            mrp, netAmount,
            price, productId, productTypeId, variantId, variantName, baseUnitTypeId, quantity, isTaxInclusive, taxes,
            taxAmount } = model;
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.remark = remark;

        this.partyUserId = partyUserId;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;

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
        this.netAmount = netAmount;
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
    }

    calculateVoucherTotalAmount(amt, qty, taxes){
        const totalAmount = (amt * qty);
        const total = (taxes || []).reduce((result, curr)=> {
            const rate = parseFloat(curr.rate || 0);
            result.taxAmount += parseFloat(curr.amount || 0);
            result.total += totalAmount + ((totalAmount * rate)/100);
            return result;
        }, {
            taxAmount: 0,
            total: 0
        });

        if(!(taxes||[]).length){
            return { taxAmount: 0, total: totalAmount};
        }
        return total;
    }
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
    // gatewayId: number;
    cardTypeId: number;
    accountId: string;
    accountGroupId: number;
    referenceNo: string;
    amount: number;
    balance: number;
    foreignAmount: number; // set from voucher

    constructor(data: any = <any>{}){
        const { modeId, gatewayMapperId, cardTypeId, accountId, accountGroupId, referenceNo, amount, balance } = data;
        this.gatewayMapperId = gatewayMapperId;
        this.modeId = modeId;
        // this.gatewayId = gatewayId;

        this.cardTypeId =  cardTypeId;

        this.accountId =  accountId;
        this.accountGroupId = accountGroupId;
        this.referenceNo =  referenceNo;
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

export class Voucher {
    name: string;
    partyUserId: string; // set this from backend based on Account  id

    accountId: string;
    accountGroupId: any;

    // Voucher Type updates
    voucherTypeId: number;
    voucherType: string;
    voucherMasterType: string;

    enableAccounting: boolean;
    enableInventory: boolean;

    defaultAccountId: string;
    defaultAccountGroupId: number;

    isItemInvoice: boolean;

    trxnId: number;
    trxnTypeId:number;
    trxnDate: string;
    trxnTypeName: string;

    voucherId: number;
    voucherNo: string;

    subTypeId: number;

    voucherDate: string;

    partyRefNo: string;
    partyRefDate: string;

    refVoucherId: number;
    refVoucherNo: string;
    refVoucherTypeId: number;

    subTotal: number;
    discount: number;
    taxAmount: number;
    amount: number;
    dueAmount: number;

    projectId: string;
    moduleId: number;

    currencyId: number;
    currencyRate: number;
    currencyCode: string;// ui to show
    currencySymbol: string;// ui to show
    systemCurrencyCode: string;// ui to show

    isRecurringVoucher: boolean;
    scheduleId: number;
    trxnScheduleId: number;
    //orderId: [null],
    acquisitionId: number;
    supplyStateId: number;

    packingCharge: number;
    deliveryCharge: number;
    roundingMethodId: number;
    rounding: any;

    notes: string;
    remark: string;

    inDraft: boolean;
    partyAccountGroupMaster: string;// find customer or vendor or  employee

    constructor(model: any = <any>{}){
        const {
            name, partyUserId, accountId, accountGroupId, defaultAccountId, defaultAccountGroupId,
            isItemInvoice,
            trxnId, trxnTypeId, trxnDate, trxnTypeName,
            voucherId, voucherNo, voucherTypeId, subTypeId, voucherType, voucherDate, voucherMasterType,
            partyRefNo, partyRefDate,
            refVoucherId, refVoucherNo, refVoucherTypeId,
            subTotal, discount, taxAmount, amount, dueAmount, projectId, moduleId, enableAccounting, enableInventory,
            currencyId, currencyRate, currencyCode, currencySymbol, systemCurrencyCode,

            isRecurringVoucher, scheduleId, trxnScheduleId, acquisitionId, supplyStateId,
            packingCharge, deliveryCharge, roundingMethodId, rounding, inDraft,
            partyAccountGroupMaster,
            notes, remark
        } = model;

        this.name = name;
        this.partyUserId = partyUserId;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.defaultAccountId = defaultAccountId;
        this.defaultAccountGroupId = defaultAccountGroupId;
        this.isItemInvoice = isItemInvoice || false;

        this.trxnId = trxnId;
        this.trxnTypeId = trxnTypeId;
        this.trxnDate = trxnDate;
        this.trxnTypeName = trxnTypeName;

        this.voucherId = voucherId;
        this.voucherNo = voucherNo;
        this.voucherTypeId = voucherTypeId;
        this.subTypeId = subTypeId || null;
        //this.voucherType = voucherType;
        this.voucherDate = DateHelper.toDateControlFormat(voucherDate);
        this.voucherMasterType = voucherMasterType ;//|| VOUCHER_TYPES.SALE;

        this.partyRefNo = partyRefNo;
        this.partyRefDate = DateHelper.toDateControlFormat(partyRefDate);

        this.refVoucherId = refVoucherId;
        this.refVoucherNo = refVoucherNo;
        this.refVoucherTypeId = refVoucherTypeId;

        this.subTotal = subTotal;
        this.discount = discount;
        this.taxAmount = taxAmount;
        this.amount = amount;
        this.dueAmount = dueAmount;

        this.projectId = projectId;
        this.moduleId = moduleId;

        this.enableAccounting = enableAccounting;
        this.enableInventory = enableInventory;

        this.currencyId = currencyId;
        this.currencyRate = currencyRate || 1;
        this.currencyCode = currencyCode;
        this.currencySymbol = currencySymbol;// ui to show
        this.systemCurrencyCode = systemCurrencyCode;

        this.isRecurringVoucher = isRecurringVoucher;
        this.scheduleId = scheduleId;
        this.trxnScheduleId = trxnScheduleId;
        this.acquisitionId = acquisitionId;
        this.supplyStateId = supplyStateId;
        this.packingCharge = packingCharge;
        this.deliveryCharge = deliveryCharge;

        this.roundingMethodId = roundingMethodId;
        this.rounding = rounding;

        this.notes = notes;
        this.remark = remark;

        this.inDraft = inDraft;
        this.partyAccountGroupMaster = partyAccountGroupMaster;
    }

    updateByVoucherType=(voucherType)=> {
        const { id, name, defaultAccountId, defaultAccountGroupId, enableAccounting, enableInventory, hasItemInvoice } = voucherType;

        this.voucherTypeId = id;
        this.voucherType = name;

        this.defaultAccountId = defaultAccountId;
        this.defaultAccountGroupId = defaultAccountGroupId;

        this.enableAccounting = enableAccounting;
        this.enableInventory = enableInventory;
        this.isItemInvoice = hasItemInvoice;
    }

    updateVoucherCurrency =(systemCurrency)=> {
        const { id, currencyCode, symbol } = systemCurrency;// system currency, we need to
        this.currencyId = id;
        this.currencyRate = 1;
        this.currencyCode = currencyCode;
        this.currencySymbol = symbol;
    }
}

export class Invoice {
    id: any;
    //systemCurrencyCode:string; //for ui controlling
    org: VoucherOrg;
    voucher: Voucher;
    items: Array<VoucherItem>;
    billToBillTrxn: Array<BillToBillTrxn>;
    sundryDetails: Array<SundryDetail>;
    trxnInfo: PaymentTransaction;
    //schedule: SchedularDomain;

    //Custom Model changes
    partyName: string;
    partyAccountId: string;
    projectId: any;
    moduleId: any;
    clientId: any;

    voucherNo: string;
    voucherId: any;
    isItemInvoice: boolean;
    voucherDate: string;
    voucherType: string;
    voucherMasterType: string;
    voucherTypeId: number;

    netAmount: number;
    remainingPayment: number;

    status: string;
    constructor(model: any = <any>{}){
        const { id, voucher, items, billToBillTrxn, sundryDetails, trxnInfo } = model;
        this.id = id;
        this.voucher = new Voucher(voucher);
        this.items = (items || []).map(r => new VoucherItem(r));
        this.billToBillTrxn = (billToBillTrxn || []).map(r => new BillToBillTrxn(r));
        this.sundryDetails = (sundryDetails || []).map(r => new SundryDetail(r));
        this.trxnInfo = new PaymentTransaction(trxnInfo);

        //additional handling
        this.partyName = this.voucher.name;
        this.partyAccountId = this.voucher.accountId;

        this.projectId = this.voucher.projectId;
        this.moduleId = this.voucher.moduleId;

        this.voucherNo = this.voucher.voucherNo;
        this.voucherId = this.voucher.voucherId;
        this.isItemInvoice = this.voucher.isItemInvoice;
        this.voucherDate = this.voucher.voucherDate;
        this.voucherType = this.voucher.voucherType;
        this.voucherMasterType = this.voucher.voucherMasterType;
        this.voucherTypeId = this.voucher.voucherTypeId;

        this.netAmount = this.voucher.amount;

        const balance = this.getPendingBalance();
        this.remainingPayment = balance;
        this.trxnInfo.amount = balance;
        this.trxnInfo.foreignAmount = balance/this.voucher.currencyRate;

        if(this.voucherMasterType == 'purchase' || this.voucherMasterType == 'sale')
        {
            if (this.remainingPayment == 0) { this.status = 'settled'; }
            else if (this.remainingPayment < 0) { this.status = 'manage'; }
        }
    }

    public getPendingBalance()
    {
        return this.voucher.amount || 0 - (this.billToBillTrxn || []).reduce(function(result, curr) { return result + curr.trxnAmount; }, 0);
    }

    populateOrg(data){ this.org = new VoucherOrg(data); }

    updateVoucherByType=(voucherType)=> this.voucher.updateByVoucherType(voucherType);
    updateVoucherBySystemCurrency=(systemCurrency)=> this.voucher.updateVoucherCurrency(systemCurrency);
}

class ProductTransactionValue extends CoreResource
{
    transactionType: string;
    transactionTypeId: number;
    netQuantity: number;
    netAmount: number;
    date: string;
    remark: string;
    sale: any;
    saleReturn: any;
    stockTransfer: any;
    purchase: any;
    purchaseReturn: any;
    transactionValues: any;

    constructor(model: any = <any>{}){
        super();
        const { id,
            transactionType, transactionTypeId, netQuantity, netAmount, date,
            sale, saleReturn, stockTransfer, purchase, purchaseReturn, transactionValues
        } = model;
        this.id = id;
        this.transactionType = transactionType;
        this.transactionTypeId = transactionTypeId;
        this.netQuantity = netQuantity;
        this.netAmount = netAmount;
        this.date = date;
        this.sale = sale;
        this.saleReturn = saleReturn;
        this.stockTransfer = stockTransfer;
        this.purchase = purchase;
        this.purchaseReturn = purchaseReturn;
        this.transactionValues = transactionValues;
    }
}

export class PurchaseOrder extends Invoice {
    constructor(model: any = <any>{}){
        super(model);
    }
}

export class SaleOrder extends Invoice {
    constructor(model: any = <any>{}){
        super(model);
    }
}

export class PurchaseOrderSerializer {
    fromJson(json: any): PurchaseOrder { return new PurchaseOrder(json); }
    toJson(model: any): any {
        const {id, name, shortName, description} = model;
        return {};
    }
}

export class SaleOrderSerializer {
    fromJson(json: any): SaleOrder { return new SaleOrder(json); }
    toJson(model: any): any {
        const {id, name, shortName, description} = model;
        return {};
    }
}
