// import { CoreQueryOptions, CoreResource } from "../../../core-setup";
// import {VOUCHER_TYPES} from "@app-base/enums/voucher-type";
//
// export class LookupGatewayAccountInfo {
//     accountId: string;
//     accountGroupId: string;
//     groupMasterType: string;
//
//     constructor(model: any = <any>{}){
//         const { id, accountId, accountGroupId, groupMasterType } = model;
//         this.accountId = accountId;
//         this.accountGroupId = accountGroupId;
//         this.groupMasterType = groupMasterType;
//     }
// }
//
// class LookupPaymentGatewayModeMapper {
//     id: string;
//     modeId: number;
//     gatewayId: number;
//     systemTypeId: number;
//
//     isPaymentAllowed: boolean;
//     isReceiptAllowed: boolean;
//
//     modeName: string;
//     gatewayName: string;
//
//     isReferenceNoRequired: boolean;
//     hasPaymentAllowed: boolean;
//     hasReceiptAllowed: boolean;
//     constructor(model: any = <any>{}){
//         const {
//             id, modeId, gatewayId, systemTypeId,
//             isPaymentAllowed, isReceiptAllowed,
//             modeName, gatewayName,
//             isReferenceNoRequired,
//             hasPaymentAllowed, hasReceiptAllowed
//         } = model;
//         this.id = id;
//         this.modeId = modeId;
//         this.gatewayId = gatewayId;
//         this.systemTypeId = systemTypeId;
//
//         this.isPaymentAllowed = isPaymentAllowed;
//         this.isReceiptAllowed = isReceiptAllowed;
//
//         this.modeName = modeName;
//         this.gatewayName = gatewayName;
//
//         this.isReferenceNoRequired = isReferenceNoRequired;
//         this.hasPaymentAllowed = hasPaymentAllowed;
//         this.hasReceiptAllowed = hasReceiptAllowed;
//     }
//     get name() { return `${this.gatewayName} ${ (this.gatewayName != this.modeName) ? ' - '+ this.modeName:'' }`; }
// }
//
// export class LookupPaymentGateway extends LookupPaymentGatewayModeMapper {
//     // isMobileWallet: boolean;
//     // isPOS: boolean;
//     // isReconciliationRequired: boolean;
//     // isReferenceNoRequired: boolean;
//     // recoFrequencyTypeId: number;
//     // recoFrequencyType: string;
//     // posNo: string;
//     providerAccount: LookupGatewayAccountInfo;
//     realizationAccount: LookupGatewayAccountInfo;
//     serviceCharges: Array<LookupServiceCharge>;
//     constructor(model: any = <any>{}){
//         super(model);
//         const {
//             isMobileWallet, isPOS, pOSNo,
//             isReconciliationRequired, isReferenceNoRequired, recoFrequencyTypeId, recoFrequencyType,
//             providerSupportNo,
//             providerAccount, realizationAccount,
//             serviceCharges
//         } = model;
//         // this.name = name;
//         // this.isMobileWallet = isMobileWallet;
//         // this.isPOS = isPOS;
//         // this.pOSNo = pOSNo;
//         // this.isReconciliationRequired = isReconciliationRequired;
//         // this.isReferenceNoRequired = isReferenceNoRequired;
//         // this.recoFrequencyTypeId = recoFrequencyTypeId;
//         // this.recoFrequencyType = recoFrequencyType;
//         // this.providerSupportNo = providerSupportNo;
//         this.providerAccount = new LookupGatewayAccountInfo(providerAccount);
//         this.realizationAccount = new LookupGatewayAccountInfo(realizationAccount);
//         this.serviceCharges = (serviceCharges || []).map(r => new LookupServiceCharge(r));
//     }
// }
//
// export class ReportLookupQueryOptions extends CoreQueryOptions {
//     customerId: string;
//     projectId: string;
//     constructor(model: any = {}){
//         super(model);
//         this.customerId = model.customerId || '';
//         this.projectId = model.projectId || '';
//     }
//
//     toQueryString (){
//         const obj = {
//             customerId:this.customerId,
//             projectId:this.projectId
//         };
//         return super.getParamByObject(obj);
//     }
// }
//
// export class OrgBranch {
//     id: any;
//     name: string;
//     branchCode: string;
//     address: string;
//     isHeadBranch: boolean;
//     isSelfAdministration: boolean;
//     taxId: string;
//     constructor(model: any = {}){
//         const {id, name, branchCode, address, isHeadBranch, isSelfAdministration, taxId} = model;
//         this.id = id;
//         this.name = name;
//         this.branchCode = branchCode;
//         this.address = address;
//         this.isHeadBranch = isHeadBranch;
//         this.isSelfAdministration = isSelfAdministration;
//         this.taxId = taxId;
//     }
// }
//
// export class Org {
//     id: any;
//     name: string;
//     orgCode: string;
//     address: string;
//     country: string;
//     taxId: string;
//     orgBranches: Array<OrgBranch>;
//
//     constructor(model: any = {}){
//         const {id, name, orgCode, address, country, taxId, orgBranches} = model;
//         this.id = id;
//         this.name = name;
//         this.orgCode = orgCode;
//         this.orgBranches = (orgBranches || []).map(r => new OrgBranch(r));
//         this.address = address;
//         this.country = country;
//         this.taxId = taxId;
//     }
// }
//
// export class BillingType {
//     id: any;
//     name: string;
//     masterType: string;
//     constructor(model: any = {}){
//         const {id, name, masterType} = model;
//         this.id = id;
//         this.name = name;
//         this.masterType = masterType;
//     }
// }
//
// export class ProjectModule {
//     id: any;
//     name: string;
//     description: string;
//     projectId: any;
//     quotationId: number;
//     constructor(model: any = {}){
//         const {id, name, description, projectId, quotationId} = model;
//         this.id = id;
//         this.name = name;
//         this.description = description;
//         this.projectId = projectId;
//         this.quotationId = quotationId;
//     }
// }
//
// export class ClientProject {
//     id: any;
//     name: string;
//     code: string;
//     shortName: string;
//     description: string;
//
//     customerId: string;
//     billingTypeId: number;
//     projectTypeId: number;
//
//     modules: Array<ProjectModule>;
//     constructor(model: any = {}){
//         const {id, name, description, code, shortName, modules, customerId, billingTypeId, projectTypeId} = model;
//         this.id = id;
//         this.name = name;
//         this.description = description;
//         this.code = code;
//         this.shortName = shortName;
//         this.modules = (modules || []).map(r =>{
//             r.projectId = id;
//             return new ProjectModule(r);
//         });
//
//         this.customerId = customerId;
//         this.billingTypeId = billingTypeId;
//         this.projectTypeId = projectTypeId;
//     }
// }
//
// export class CommonUser {
//     id: any;
//     name: string;
//     phone: string;
//     mail: string;
//     accountId: string;
//     accountGroupId: number;
//     userId: string;
//     userTypeId: string;
//
//     constructor(model: any = {}){
//         const {id, name, phone, mail, userId, userTypeId, accountId, accountGroupId} = model;
//         this.id = id;
//         this.name = name;
//         this.phone = phone;
//         this.mail = mail;
//
//         this.accountId = accountId;
//         this.accountGroupId = accountGroupId;
//
//         this.userId = userId;
//         this.userTypeId = userTypeId;
//     }
// }
//
// export class Client extends CommonUser {
//     companyName: string;
//     constructor(model: any = {}){
//         super(model);
//         const {companyName} = model;
//         this.companyName = companyName;
//     }
// }
//
// export class VendorBranchLookup extends CommonUser {
//     vendorId: string;
//     constructor(model: any = {}){
//         super(model);
//         const {vendorId} = model;
//         this.vendorId = vendorId;
//     }
// }
//
// export class Division {
//     id: any;
//     name: string;
//     constructor(model: any = {}){
//         const {id, name} = model;
//         this.id = id;
//         this.name = name;
//     }
// }
//
// export class ProjectType {
//     id: any;
//     name: string;
//     constructor(model: any = {}){
//         const {id, name} = model;
//         this.id = id;
//         this.name = name;
//     }
// }
//
// export class ProductType {
//     id: any;
//     name: string;
//     constructor(model: any = {}){
//         const {id, name} = model;
//         this.id = id;
//         this.name = name;
//     }
// }
//
// export class ResourceType {
//     id: any;
//     name: string;
//     constructor(model: any = {}){
//         const {id, name} = model;
//         this.id = id;
//         this.name = name;
//     }
// }
//
// export class Status {
//     id: any;
//     name: string;
//     isDefault: boolean;
//     constructor(model: any = {}){
//         const {id, name, isDefault} = model;
//         this.id = id;
//         this.name = name;
//         this.isDefault = isDefault;
//     }
// }
//
// export class SundryType {
//     id: string;
//     name: string;
//     hasTax: boolean;
//     hasVoucherCredit: boolean;
//     accountId: string;
//     accountGroupId: number;
//     accountMasterType: string;
//     accountGroupMasterType: string;
//
//     constructor(model: any = <any>{}) {
//         this.id = model.id;
//         this.name = model.name;
//         this.hasTax = model.hasTax;
//         this.hasVoucherCredit = model.hasVoucherCredit || false;
//         this.accountId = model.accountId;
//         this.accountGroupId = model.accountGroupId;
//         this.accountMasterType = model.accountMasterType;
//         this.accountGroupMasterType = model.accountGroupMasterType;
//     }
// }
//
// export class LookupServiceCharge {
//     id: number;
//     name: string;
//     gatewayId: number;
//     modeId: number;
//     cardTypeId: number;
//
//     serviceChargeRate: number;
//     taxRate: number;
//     trxnAmountFrom: string;
//     trxnAmountTo: string;
//
//
//     mode: string;
//     modeDescription: string;
//     isReceiptAllowed: boolean;
//     isPaymentAllowed: boolean;
//     cardType: string;
//
//     constructor(model: any = <any>{}){
//         const { id, name, gatewayId, modeId, cardTypeId,
//             serviceChargeRate, taxRate, trxnAmountFrom, trxnAmountTo,
//             mode, modeDescription, isReceiptAllowed, isPaymentAllowed, cardType
//         } = model;
//         this.id = id;
//         this.name = name;
//         this.gatewayId = gatewayId;
//         this.modeId = modeId;
//         this.cardTypeId = cardTypeId;
//         this.serviceChargeRate = serviceChargeRate;
//         this.taxRate = taxRate;
//         this.trxnAmountFrom = trxnAmountFrom;
//         this.trxnAmountTo = trxnAmountTo;
//
//         this.mode = mode;
//         this.modeDescription = modeDescription;
//         this.isReceiptAllowed = isReceiptAllowed;
//         this.isPaymentAllowed = isPaymentAllowed;
//         this.cardType = cardType;
//     }
// }
//
// export class LookupGatewayModes {
//     id: string;
//     name: string;
//     constructor(model: any = {}) {
//         const { id, name } = model;
//         this.id = id;
//         this.name = name;
//     }
// }
//
// class LookupTaxMapper {
//     id: number;
//     name: string;
//     taxTypeRateId: number;
//     categoryId: number;
//     rate: number;
//     hasExtraTaxRate: boolean;
//     extraTaxRate: number;
//
//     status: boolean;
//     sortOrder: number;
//
//     isTaxInclusive: boolean;
//     accountId: string;
//
//     supplyTypeId: number;
//     voucherTypeId: number;
//     voucherMasterType: string;
//     constructor(model: any = <any>{}){
//         const { id, name,
//             taxTypeRateId, categoryId,
//             rate, hasExtraTaxRate, extraTaxRate,
//
//             accountId, isTaxInclusive,
//             supplyTypeId, voucherTypeId, voucherMasterType,
//             status, sortOrder
//         } = model;
//         this.id = id;
//         this.name = name;
//
//         this.categoryId = categoryId;
//         this.taxTypeRateId = taxTypeRateId;
//
//         this.rate = rate;
//         this.hasExtraTaxRate = hasExtraTaxRate;
//         this.extraTaxRate = extraTaxRate;
//
//         this.isTaxInclusive = isTaxInclusive;
//         this.accountId = accountId;
//
//         this.status = status;
//         this.sortOrder = sortOrder;
//
//         this.supplyTypeId = supplyTypeId;
//         this.voucherTypeId = voucherTypeId;
//         this.voucherMasterType = voucherMasterType;
//     }
// }
//
// export class LookupVoucherType {
//     id: any;
//     name: string;
//     masterType: string;
//     abbreviation: string;
//     voucherNoDisplay: string;
//     voucherDateDisplay: string;
//     isPrimary: boolean;
//
//     sortOrder: number;
//     isDefault: boolean;
//     isTaxInclude: boolean;
//     defaultAccountId: string;
//     defaultAccountGroupId: number;
//
//     askForRefParty: boolean;
//     askForRefVoucher: boolean;
//     enableAccounting: boolean;
//     enableInventory: boolean;
//
//     isPrimaryCredit: boolean;
//
//     canDoLedgerOrItem: boolean;
//     hasItemInvoice: boolean;
//     canSchedule: boolean;
//     canBeRecurring: boolean;
//     hasDraft: boolean;
//
//     constructor(model: any = {}){
//         const {id, name, masterType,
//             abbreviation, voucherNoDisplay, voucherDateDisplay,
//             sortOrder, isDefault,
//             isPrimary, isTaxInclude, defaultAccountId, defaultAccountGroupId,
//             askForRefParty, askForRefVoucher,
//             enableAccounting, enableInventory,
//             isPrimaryCredit,
//             canDoLedgerOrItem, hasItemInvoice, canSchedule, canBeRecurring, hasDraft
//         } = model;
//         this.id = id;
//         this.name = name;
//         this.masterType = masterType;
//         this.abbreviation = abbreviation;
//         this.voucherNoDisplay = voucherNoDisplay;
//         this.voucherDateDisplay = voucherDateDisplay;
//
//         this.sortOrder  = sortOrder;
//         this.isDefault = isDefault;
//         this.isPrimary = isPrimary;
//
//         this.isTaxInclude = isTaxInclude;
//         this.defaultAccountId = defaultAccountId;
//         this.defaultAccountGroupId = defaultAccountGroupId;
//
//         this.askForRefParty  = askForRefParty;
//         this.askForRefVoucher = askForRefVoucher;
//         this.enableAccounting  = enableAccounting;
//         this.enableInventory = enableInventory;
//
//         this.isPrimaryCredit = isPrimaryCredit;
//
//         this.canDoLedgerOrItem = canDoLedgerOrItem;
//         this.hasItemInvoice = hasItemInvoice;
//         this.canSchedule = canSchedule;
//         this.canBeRecurring = canBeRecurring;
//         this.hasDraft = hasDraft;
//     }
// }
//
//
// export class LookupVoucherSetupSideOption {
//     showInvoiceLedger: boolean;
//     showSubItem: boolean;
//     showProject: boolean;
//     constructor(model: any = {}){
//         const { showInvoiceLedger, showSubItem, showProject } = model;
//         this.showInvoiceLedger = showInvoiceLedger;
//         this.showSubItem = showSubItem;
//         this.showProject = showProject;
//     }
// }
//
// export class LookupVoucherSetupOption {
//     hasClient: boolean;
//     isItemInvoice: boolean;
//     hasVendor: boolean;
//     sideOption: LookupVoucherSetupSideOption;
//     constructor(model: any = {}){
//         const {hasClient, isItemInvoice, hasVendor, sideOption} = model;
//         this.hasClient = hasClient;
//         this.isItemInvoice = isItemInvoice;
//         this.hasVendor = hasVendor;
//         this.sideOption = new LookupVoucherSetupSideOption(sideOption)
//     }
// }
//
// class VoucherCommonLookup extends CoreResource {
//     roundOffType = { positive: 'positive', negative: 'negative' };
//     gateways: Array<LookupPaymentGateway>;
//     taxMappers: Array<LookupTaxMapper>;
//     sundryTypes: Array<SundryType>;
//
//     // billingTypes: Array<BillingType>;
//     // productTypes: Array<ProductType>;
//     // resourceTypes: Array<ResourceType>;
//     // vendorBranches: Array<VendorBranchLookup>;
//
//     constructor(model: any = <any>{}){
//         super();
//         const {
//             gateways, taxMappers,
//             sundryTypes,
//             productTypes
//         } = model;
//         this.gateways = (gateways || []).map(r => new LookupPaymentGateway(r));
//         this.taxMappers = (taxMappers || []).map(r => new LookupTaxMapper(r));
//         this.sundryTypes = (sundryTypes || []).map(r => new SundryType(r));
//         //this.productTypes = (productTypes || []).map(r => new ProductType(r));
//     }
//
//     getTaxMapperById = (tax_mapper_id) => (this.taxMappers || []).find(r => r.id == tax_mapper_id);
//     getSundryTypeBasedOnId =(sundryTypeId)=> (this.sundryTypes || []).find(r => r.id == sundryTypeId);
//     getSundryTypeIdBasedOnName=(name)=> (this.sundryTypes || []).find(r => r.name === name) || null;
//
//     getPaymentGatewayById=(gatewayId)=> (this.gateways || []).find(r => r.id == gatewayId);
//
//     getSundryTypeByKey=(voucherMasterType, key)=>{
//         let account_key;
//         switch (key) {
//             case 'discount':
//                 if(voucherMasterType == VOUCHER_TYPES.PURCHASE){ account_key = 'purchase_discount'; }
//                 if(voucherMasterType == VOUCHER_TYPES.SALE){ account_key = 'sale_discount'; }
//                 break;
//         }
//         if(!account_key){
//             return null;
//         }
//         return this.sundryTypes.find(r => r.accountMasterType == account_key);
//     }
//
//     getSundryTypeByKeyValue(voucherMasterType, key, value) {
//         const _roundOff = (value > 0) ? this.roundOffType.positive : (value < 0) ? this.roundOffType.negative : '';
//
//         let account_key;
//         switch (key) {
//             case 'round_off':
//                 if(voucherMasterType == VOUCHER_TYPES.PURCHASE) {
//                     if(_roundOff == this.roundOffType.positive) {
//                         account_key = 'purchase_positive_round_off';
//                     }
//                     if(_roundOff == this.roundOffType.negative) {
//                         account_key = 'purchase_negative_round_off';
//                     }
//                     account_key = 'purchase_round_off';
//                 }
//                 if(voucherMasterType == VOUCHER_TYPES.SALE){
//                     if(_roundOff == this.roundOffType.positive) {
//                         account_key = 'sale_positive_round_off';
//                     }
//                     if(_roundOff == this.roundOffType.negative) {
//                         account_key = 'sale_negative_round_off';
//                     }
//                     account_key = 'sale_round_off';
//                 }
//                 break;
//         }
//         if(!account_key){
//             return null;
//         }
//         return this.sundryTypes.find(r => r.accountMasterType == account_key);
//     }
// }
//
// export class FinancePluginLookup extends VoucherCommonLookup {
//     date: Date;
//
//     constructor(model: any = <any>{}) {
//         super(model);
//         const { currencies, languages, orgSessions, mediaTypes } = model;
//         this.date = model.date;
//         //const { clients, projects } = model;
//         // this.division = (division || []).map(r => new Division(r));
//         // this.projectTypes = (projectType || []).map(r => new ProjectType(r));
//         // this.clients = (clients || []).map(r => new Client(r));
//         // this.projects = (projects || []).map(r => new ClientProject(r));
//     }
//
//     /*getClientByAccountId(partyAccountId): Client{
//         return this.clients.find(r => r.accountId == partyAccountId);
//     }
//
//     getClientById(clientId): Client{
//         return this.clients.find(r => r.id == clientId);
//     }*/
//
//     getPaymentGateways =()=> this.gateways.filter(r => r.hasPaymentAllowed);
//     getReceiptGateways =()=> this.gateways.filter(r => r.hasReceiptAllowed);
//     getSundryTypeIdBasedOnName = (name)=> this.sundryTypes.find(r => r.name === name) || null;
//     getSundryTypeAccount = (accountMasterType)=> this.sundryTypes.find(r => r.accountMasterType == accountMasterType);
//     //getVendorByAccountId = (accountId) => this.vendorBranches.find(r => r.accountId == accountId);
// }
//
//
// export class FinancePluginLookupSerializer {
//     fromJson(json: any): FinancePluginLookup { return new FinancePluginLookup(json); }
//     toJson(data: any): any { return null; }
// }