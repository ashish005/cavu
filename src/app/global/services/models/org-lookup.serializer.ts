import {VOUCHER_TYPES} from "../../enums/voucher-type";
import {FREQUENCY_TYPE} from "../../enums";

class Status {
    id: any;
    name: string;
    isDefault: boolean;

    constructor(model: any = {}) {
        const {id, name, isDefault} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
    }
}

export class PurchaseOrderType {
    id: any;
    name: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = {}) {
        const {id, name, isDefault, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class PurchaseType {
    id: any;
    name: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = {}) {
        const {id, name, isDefault, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class QuotationType {
    id: any;
    name: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = {}) {
        const {id, name, isDefault, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class SaleOrderType {
    id: any;
    name: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = {}) {
        const {id, name, isDefault, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class SaleType {
    id: any;
    name: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = {}) {
        const {id, name, isDefault, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class StockTransferType {
    id: any;
    name: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = {}) {
        const {id, name, isDefault, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class CurrencyMapper {
    id: number;
    currencyId: number;
    name: string;
    currencyCode: string;
    symbol: string;
    isEnabled: boolean;
    isDisplayed: boolean;
    isDefault: boolean;

    constructor(model: any = <any>{}) {
        const {id, currencyId, name, currencyCode, symbol, isEnabled, isDisplayed, isDefault} = model;
        this.id = id;
        this.currencyId = currencyId;
        this.name = name;
        this.currencyCode = currencyCode;
        this.symbol = symbol;
        this.isEnabled = isEnabled;
        this.isDisplayed = isDisplayed;
        this.isDefault = isDefault;
    }

    get currencyName() {
        return `${this.name} ( ${this.symbol} )`;
    }
}

export class LanguageMapper {
    id: number;
    languageId: number;
    name: string;
    cultureCode: string;
    isEnabled: boolean;
    isDefault: boolean;

    constructor(model: any = <any>{}) {
        const {id, languageId, name, cultureCode, isEnabled, isDefault} = model;
        this.id = id;
        this.languageId = languageId;
        this.name = name;
        this.cultureCode = cultureCode;
        this.isEnabled = isEnabled;
        this.isDefault = isDefault;
    }
}

export class OrgSession {
    id: number;
    name: string;
    startDate: string;
    fromYear: string;
    toYear: string;

    constructor(model: any = {}) {
        const {id, name, startDate, fromYear, toYear} = model;
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.fromYear = fromYear;
        this.toYear = toYear;
    }
}

export class LookupVoucherType {
    id: any;
    name: string;
    displayText: string;
    masterType: string;
    abbreviation: string;
    voucherNoDisplay: string;
    voucherDateDisplay: string;
    isPrimary: boolean;

    sortOrder: number;
    isDefault: boolean;
    isTaxInclude: boolean;
    defaultAccountId: string;
    defaultAccountGroupId: number;

    askForRefParty: boolean;
    askForRefVoucher: boolean;
    enableAccounting: boolean;
    enableInventory: boolean;

    isPrimaryCredit: boolean;

    canDoLedgerOrItem: boolean;
    hasItemInvoice: boolean;
    canSchedule: boolean;
    canBeRecurring: boolean;
    hasDraft: boolean;

    constructor(model: any = {}) {
        const {
            id, name, masterType, displayText,
            abbreviation, voucherNoDisplay, voucherDateDisplay,
            sortOrder, isDefault,
            isPrimary, isTaxInclude, defaultAccountId, defaultAccountGroupId,
            askForRefParty, askForRefVoucher,
            enableAccounting, enableInventory,
            isPrimaryCredit,
            canDoLedgerOrItem, hasItemInvoice, canSchedule, canBeRecurring, hasDraft
        } = model;
        this.id = id;
        this.name = name;
        this.displayText = displayText;
        this.masterType = masterType;
        this.abbreviation = abbreviation;
        this.voucherNoDisplay = voucherNoDisplay;
        this.voucherDateDisplay = voucherDateDisplay;

        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.isPrimary = isPrimary;

        this.isTaxInclude = isTaxInclude;
        this.defaultAccountId = defaultAccountId;
        this.defaultAccountGroupId = defaultAccountGroupId;

        this.askForRefParty = askForRefParty;
        this.askForRefVoucher = askForRefVoucher;
        this.enableAccounting = enableAccounting;
        this.enableInventory = enableInventory;

        this.isPrimaryCredit = isPrimaryCredit;

        this.canDoLedgerOrItem = canDoLedgerOrItem;
        this.hasItemInvoice = hasItemInvoice;
        this.canSchedule = canSchedule;
        this.canBeRecurring = canBeRecurring;
        this.hasDraft = hasDraft;
    }
}

export class LookupVoucherSetupSideOption {
    showInvoiceLedger: boolean;
    showSubItem: boolean;
    showProject: boolean;

    constructor(model: any = {}) {
        const {showInvoiceLedger, showSubItem, showProject} = model;
        this.showInvoiceLedger = showInvoiceLedger;
        this.showSubItem = showSubItem;
        this.showProject = showProject;
    }
}

export class LookupVoucherSetupOption {
    hasClient: boolean;
    isItemInvoice: boolean;
    hasVendor: boolean;
    sideOption: LookupVoucherSetupSideOption;

    constructor(model: any = {}) {
        const {hasClient, isItemInvoice, hasVendor, sideOption} = model;
        this.hasClient = hasClient;
        this.isItemInvoice = isItemInvoice;
        this.hasVendor = hasVendor;
        this.sideOption = new LookupVoucherSetupSideOption(sideOption)
    }
}

export class LookupFrequencyType {
    id: number;
    name: string;
    masterType: string;
    isFeeType: boolean;
    isPeriodType: boolean;
    isOnEvent: boolean;
    isDefault: boolean;
    constructor(model: any = <any>{}) {
        const {id, name, masterType, isFeeType, isPeriodType, isOnEvent} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.isFeeType = isFeeType;
        this.isPeriodType = isPeriodType;
        this.isOnEvent = isOnEvent;
        this.isDefault = (masterType == FREQUENCY_TYPE.FIXED_TIME)
    }

    get isMonthly(){ return this.masterType == FREQUENCY_TYPE.MONTHLY;}
    get isFixedTime(){ return this.masterType == FREQUENCY_TYPE.FIXED_TIME;}
}

export class LookupVoucherStatus {
    id: number;
    name: string;
    masterType: string;
    sortOrder: number;
    constructor(model: any = <any>{}) {
        const { id, name, masterType, sortOrder } = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.sortOrder = sortOrder;
    }
}

class OrgBranch {
    id: number;
    name: string;
    timeZone: string;
    countryId: number;
    currencyId: number;
    currencyCode: string;
    languageId: number;
    cultureCode: string;

    constructor(model: any = <any>{}) {
        const {id, name, timeZone, countryId, currencyId, currencyCode, languageId, cultureCode } = model;
        this.id = id;
        this.name = name;
        this.timeZone = timeZone;
        this.countryId = countryId;
        this.currencyId = currencyId;
        this.currencyCode = currencyCode;
        this.languageId = languageId;
        this.cultureCode = cultureCode;
    }
}
class OrgLoginUser {
    id: number;
    orgUserId: string;
    fName: string;
    lName: string;
    email: string;
    phone: string;
    userMasterType: string;
    roles: Array<string>;

    constructor(model: any = <any>{}) {
        const {id, orgUserId, fName, lName, email, phone, userMasterType, roles } = model;
        this.id = id;
        this.orgUserId = orgUserId;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.phone = phone;
        this.userMasterType = userMasterType;
        this.roles = (roles || []).map(r => { name: r.name });
    }
}

export class GroupedVoucherType {
    accounting: Array<LookupVoucherType> = [];
    inventory: Array<LookupVoucherType> = [];
    order: Array<LookupVoucherType> = [];
    acct_inventory: Array<LookupVoucherType> = [];
    constructor(voucherTypes: Array<any>) {
        (voucherTypes || []).forEach(current => {
            if (current.enableInventory && current.enableAccounting) {
                this.acct_inventory.push(current);
            }
            else if (current.enableAccounting) {
                this.accounting.push(current);
            }
            else if (current.enableInventory) {
                this.inventory.push(current);
            }
            else if (!current.enableInventory && !current.enableAccounting) {
                this.order.push(current);
            }
        });
    }
}

class VoucherCommonLookup {
    id: any;
    purchaseTypes: Array<PurchaseType>;
    purchaseOrderTypes: Array<PurchaseOrderType>;
    quotationTypes: Array<QuotationType>;
    saleOrderTypes: Array<SaleOrderType>;
    saleTypes: Array<SaleType>;
    stockTransferTypes: Array<StockTransferType>;

    voucherTypes: Array<LookupVoucherType>;
    voucherSubTypes: any;
    groupedVoucherTypes: GroupedVoucherType;
    voucherTypeDictionary: object;
    voucherProcessStatuses: Array<LookupVoucherStatus> = [];

    taxMappers: Array<any> = [];
    constructor(model: any = <any>{}) {
        const {
            purchaseOrderTypes, purchaseTypes, quotationTypes, saleOrderTypes, saleTypes, voucherTypes, voucherSubTypes, voucherProcessStatuses
        } = model;

        this.voucherTypes = (voucherTypes || []).map(r => new LookupVoucherType(r));
        this.voucherSubTypes = voucherSubTypes;
        this.purchaseOrderTypes = (purchaseOrderTypes || []).map(r => new PurchaseOrderType(r));
        this.purchaseTypes = (purchaseTypes || []).map(r => new PurchaseType(r));
        this.quotationTypes = (quotationTypes || []).map(r => new QuotationType(r));
        this.saleOrderTypes = (saleOrderTypes || []).map(r => new SaleOrderType(r));
        this.saleTypes = (saleTypes || []).map(r => new SaleType(r));
        this.voucherProcessStatuses = (voucherProcessStatuses || []).map(r => new LookupVoucherStatus(r));

        this.voucherTypeDictionary = this.voucherTypes.reduce((res, curr) => {
            res[curr.masterType] = curr;
            return res;
        }, {});

        this.groupedVoucherTypes = new GroupedVoucherType(this.voucherTypes);
    }

    private search = {
        forCreditTrxn: {
            ledgerWise: {
                purchase: ['Sundry Creditors', 'Bank Accounts', 'Cash Accounts'],
                credit_note: ['Sundry Creditors', 'Bank Accounts', 'Cash Accounts'],
                sale_return: ['Sundry Creditors', 'Bank Accounts', 'Cash Accounts'],
                sale: ['Sales Accounts', 'Indirect Income'],
                purchase_return: ['Sales Accounts'],
                debit_note: ['Sales Accounts'],
                payment: ['Bank Accounts', 'Cash Accounts'],
                receipt: ['Everything except Payment Account'],
                purchase_order: ['Vendor'],
                sale_order: ['Products/ Services'],
                contra: ['Bank Accounts', 'Cash Accounts'],
                journal: ['All except Bank Accounts and Cash Accounts']
            },
            itemWise: {
                purchase: ['Sundry Creditors'],
                creditNote: ['Sundry Creditors'],
                sale_return: ['Sundry Creditors'],
                sale: ['Sales Accounts'],
                purchase_return: ['Sales Accounts'],
                debit_note: ['Sales Accounts'],
                payment: ['Bank Accounts', 'Cash Accounts'],
                receipt: ['Everything except Payment Account'],
                purchase_order: ['Vendor'],
                sale_order: ['Products/ Services'],
                contra: ['Bank Accounts', 'Cash Accounts'],
                journal: ['All except Bank Accounts and Cash Accounts']
            }
        },
        forDebitTrxn: {
            ledgerWise: {
                purchase: ['Direct Expense', 'Indirect Expense', 'Fixed Aassets'],
                credit_note: ['Direct Expense', 'Indirect Expense', 'Fixed Aassets'],
                sale_return: ['Direct Expense', 'Indirect Expense', 'Fixed Aassets'],
                sale: ['Sundry debtors', 'Bank Accounts', 'Cash Accounts'],
                purchase_return: ['Sundry debtors', 'Bank Accounts', 'Cash Accounts'],
                debit_note: ['Sundry debtors', 'Bank Accounts', 'Cash Accounts'],
                payment: ['Sundry debtors', 'Sundry Creditors', 'Direct Expense', 'Indirect Expense', 'Fixed Aassets'],
                receipt: ['Bank Accounts', 'Cash Accounts'],
                purchase_order: ['Products/ Services'],
                sale_order: ['Customer'],
                contra: ['Bank Accounts', 'Cash Accounts'],
                journal: ['All except Bank Accounts and Cash Accounts']
            },
            itemWise: {
                purchase: ['Purchase Accounts'],
                creditNote: ['Purchase Accounts'],
                sale_return: ['Purchase Accounts'],
                sale: ['Sundry debtors'],
                purchase_return: ['Sundry debtors'],
                debit_note: ['Sundry debtors'],
                payment: ['Sundry debtors', 'Sundry Creditors', 'Direct Expense', 'Indirect Expense', 'Fixed Aassets'],
                receipt: ['Bank Accounts', 'Cash Accounts'],
                purchase_order: ['Products/ Services'],
                sale_order: ['Customer'],
                contra: ['Bank Accounts', 'Cash Accounts'],
                journal: ['All except Bank Accounts and Cash Accounts']
            }
        }
    };

    getSearchAccounts = (iscredit, voucherMasterType, isItemInvoice: boolean) => {
        let trxn = (iscredit) ? 'forCreditTrxn' : 'forDebitTrxn';
        let type = isItemInvoice ? 'itemWise' : 'ledgerWise';
        return this.search[trxn][type][voucherMasterType];
    };

    getVoucherTypeByMasterType = (voucherMasterType) => this.voucherTypes.find(r => r.masterType == voucherMasterType);
    getPaymentVoucher = () => this.voucherTypes.find(r => r.masterType == 'payment');
    getReceiptVoucher = () => this.voucherTypes.find(r => r.masterType == 'receipt');

    isVendorVoucher = (voucherMasterType) => [
        VOUCHER_TYPES.PAYMENT,
        VOUCHER_TYPES.PURCHASE,
        'expense',
        VOUCHER_TYPES.PURCHASE_ORDER
    ].some(r => r == voucherMasterType);

    hasPaymentGateways = (voucherMasterType) => [
        VOUCHER_TYPES.PAYMENT, VOUCHER_TYPES.PURCHASE, 'expense', VOUCHER_TYPES.PURCHASE_ORDER
    ].some(r => r == voucherMasterType);

    hasReceiptGateways = (voucherMasterType) => [
        VOUCHER_TYPES.RECEIPT, VOUCHER_TYPES.SALE, VOUCHER_TYPES.SALE_ORDER
    ].some(r => r == voucherMasterType);

    getVoucherSubItemsByMasterType = (voucherMasterType: string) => {
        const voucherSubType = this.voucherSubTypes[voucherMasterType];
        return this[voucherSubType] || [];
    };
}

export class OrgLookup extends VoucherCommonLookup {
    date: Date;
    orgBranch: OrgBranch;
    loginUser: OrgLoginUser;
    roles: Array<any>;
    currencies: Array<CurrencyMapper>;
    languages: Array<LanguageMapper>;
    orgSessions: Array<OrgSession>;
    frequencyTypes: Array<LookupFrequencyType> = [];

    constructor(model: any = <any>{}) {
        super(model);
        const { currencies, languages, orgSessions, frequencyTypes, orgBranch, loginUser, roles } = model;
        this.date = model.date;
        this.orgBranch = orgBranch ? new OrgBranch(orgBranch): null;
        this.loginUser = loginUser ? new OrgLoginUser(loginUser): null;
        this.roles = (roles || []).map(r => <any>{
            id: r.id,
            orgUserRoleId: r.orgUserRoleId,
            name: r.name,
        });
        this.currencies = (currencies || []).map(r => new CurrencyMapper(r));
        this.languages = (languages || []).map(r => new LanguageMapper(r));
        this.orgSessions = (orgSessions || []).map(r => new OrgSession(r));
        this.frequencyTypes = (frequencyTypes || []).map(r => new LookupFrequencyType(r));
    }
    public defaultFrequency=()=> (this.frequencyTypes || []).find(r => r.isDefault);
    public getFeeFrequencies=()=> (this.frequencyTypes || []).filter(r => r.isFeeType);

    getDefaultOrgCurrency = () => this.getOrgCurrency(this.orgBranch?.currencyCode);
    getDefaultOrgLanguage = () => this.getOrgLanguage(this.orgBranch?.cultureCode);

    getOrgCurrency = (currencyCode: string) => (this.currencies || []).find(r => r.currencyCode == currencyCode);
    getOrgLanguage = (cultureCode: string) => (this.languages || []).find(r => r.cultureCode == cultureCode);

    isSoftwareSeeded = () => (this.currencies?.length && this.languages?.length);

    hasValidSetup = () => {
        const systemCurrency = this.getDefaultOrgCurrency();
        const language = this.getDefaultOrgLanguage();

        if (!(this.orgBranch && systemCurrency && language && this.loginUser)) {
            return false;
        }
        return true;
    }
}

export class OrgLookupSerializer {
    fromJson(json: any): OrgLookup { return new OrgLookup(json); }
    toJson(data: any): any { return null; }
}
