import {CoreQueryOptions} from "@app-global";

// Account Nature
export class AccountNature {
  id: number;
  name: string;
  code: string;

  constructor(model: any = <any>{}) {
    const { id, name, code } = model;
    this.id = id;
    this.name = name;
    this.code = code;
  }
}

// Supply Nature
export class SupplyNature {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  isDefault: boolean;

  constructor(model: any = <any>{}) {
    const { id, name, code, sortOrder, isDefault } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.sortOrder = sortOrder;
    this.isDefault = isDefault;
  }
}

// Bank
export class Bank {
  id: string;
  name: string;
  code: string;
  bic: string;
  countryId: number;
  isCentralBank: boolean;
  isCommercialBank: boolean;
  isCooperative: boolean;

  constructor(model: any = <any>{}) {
    const { id, name, code, bic, countryId, isCentralBank, isCommercialBank, isCooperative } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.bic = bic;
    this.countryId = countryId;
    this.isCentralBank = isCentralBank;
    this.isCommercialBank = isCommercialBank;
    this.isCooperative = isCooperative;
  }
}

// Bank Branch
export class BankBranch {
  id: string;
  name: string;
  externalCode: string;
  bankId: string;
  bic: string;
  city: string;
  isActive: boolean;

  constructor(model: any = <any>{}) {
    const { id, name, externalCode, bankId, bic, city, isActive } = model;
    this.id = id;
    this.name = name;
    this.externalCode = externalCode;
    this.bankId = bankId;
    this.bic = bic;
    this.city = city;
    this.isActive = isActive;
  }
}

// Bank Account Type
export class BankAccountType {
  id: number;
  name: string;
  code: string;
  description: string;
  sortOrder: number;
  isBusiness: boolean;
  isPersonal: boolean;
  supportsIncoming: boolean;
  supportsOutgoing: boolean;

  constructor(model: any = <any>{}) {
    const { id, name, code, description, sortOrder, isBusiness, isPersonal, supportsIncoming, supportsOutgoing } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.sortOrder = sortOrder;
    this.isBusiness = isBusiness;
    this.isPersonal = isPersonal;
    this.supportsIncoming = supportsIncoming;
    this.supportsOutgoing = supportsOutgoing;
  }
}

// Bank Identifier Type
export class BankIdentifierType {
  id: number;
  name: string;
  code: string;
  description: string;
  isGlobal: boolean;
  sortOrder: number;

  constructor(model: any = <any>{}) {
    const { id, name, code, description, isGlobal, sortOrder } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.isGlobal = isGlobal;
    this.sortOrder = sortOrder;
  }
}

// Payment Card Type
export class PaymentCardType {
  id: number;
  name: string;
  code: string;
  description: string;
  category: number;
  supportsContactless: boolean;
  supportsOnline: boolean;
  supportsRecurring: boolean;
  supportsTokenization: boolean;
  sortOrder: number;

  constructor(model: any = <any>{}) {
    const { id, name, code, description, category, supportsContactless, supportsOnline, supportsRecurring, supportsTokenization, sortOrder } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.category = category;
    this.supportsContactless = supportsContactless;
    this.supportsOnline = supportsOnline;
    this.supportsRecurring = supportsRecurring;
    this.supportsTokenization = supportsTokenization;
    this.sortOrder = sortOrder;
  }
}

// Bank Instrument Type
export class BankInstrumentType {
  id: number;
  name: string;
  code: string;
  description: string;
  sortOrder: number;

  constructor(model: any = <any>{}) {
    const { id, name, code, description, sortOrder } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.sortOrder = sortOrder;
  }
}

// Payment Provider
export class PaymentProvider {
  id: number;
  name: string;
  code: string;
  type: number;
  website: string;
  description: string;

  constructor(model: any = <any>{}) {
    const { id, name, code, type, website, description } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.type = type;
    this.website = website;
    this.description = description;
  }
}

// Payment Rail
export class PaymentRail {
  id: number;
  name: string;
  code: string;
  type: number;
  description: string;

  constructor(model: any = <any>{}) {
    const { id, name, code, type, description } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.type = type;
    this.description = description;
  }
}

// Payment Mode
export class PaymentMode {
  id: number;
  name: string;
  code: string;
  description: string;
  systemTypeId: number;
  supportsRefund: boolean;
  supportsPartialRefund: boolean;
  supportsRecurring: boolean;
  supportsTokenization: boolean;

  constructor(model: any = <any>{}) {
    const { id, name, code, description, systemTypeId, supportsRefund, supportsPartialRefund, supportsRecurring, supportsTokenization } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.systemTypeId = systemTypeId;
    this.supportsRefund = supportsRefund;
    this.supportsPartialRefund = supportsPartialRefund;
    this.supportsRecurring = supportsRecurring;
    this.supportsTokenization = supportsTokenization;
  }
}

// Payment System Type
export class PaymentSystemType {
  id: number;
  name: string;
  code: string;
  description: string;
  category: number;
  supportsIncoming: boolean;
  supportsOutgoing: boolean;
  supportsRefund: boolean;

  constructor(model: any = <any>{}) {
    const { id, name, code, description, category, supportsIncoming, supportsOutgoing, supportsRefund } = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.category = category;
    this.supportsIncoming = supportsIncoming;
    this.supportsOutgoing = supportsOutgoing;
    this.supportsRefund = supportsRefund;
  }
}

// Country Payment Rail
export class CountryPaymentRail {
  id: number;
  countryId: number;
  paymentRailId: number;
  paymentRailName: string;
  paymentRailCode: string;
  supportsIncoming: boolean;
  supportsOutgoing: boolean;
  supportsRefund: boolean;
  supportsRecurring: boolean;
  supportsMandate: boolean;
  effectiveFrom: string;
  effectiveTo: string;

  constructor(model: any = <any>{}) {
    const { id, countryId, paymentRailId, paymentRailName, paymentRailCode, supportsIncoming, supportsOutgoing, supportsRefund, supportsRecurring, supportsMandate, effectiveFrom, effectiveTo } = model;
    this.id = id;
    this.countryId = countryId;
    this.paymentRailId = paymentRailId;
    this.paymentRailName = paymentRailName;
    this.paymentRailCode = paymentRailCode;
    this.supportsIncoming = supportsIncoming;
    this.supportsOutgoing = supportsOutgoing;
    this.supportsRefund = supportsRefund;
    this.supportsRecurring = supportsRecurring;
    this.supportsMandate = supportsMandate;
    this.effectiveFrom = effectiveFrom;
    this.effectiveTo = effectiveTo;
  }
}

// Combined Banking Setup Lookup
export class BankingSetupLookup {
  accountNatures: AccountNature[];
  supplyNatures: SupplyNature[];
  banks: Bank[];
  bankAccountTypes: BankAccountType[];
  bankIdentifierTypes: BankIdentifierType[];
  paymentCardTypes: PaymentCardType[];
  bankInstrumentTypes: BankInstrumentType[];

  constructor(model: any = <any>{}) {
    const { accountNatures, supplyNatures, banks, bankAccountTypes, bankIdentifierTypes, paymentCardTypes, bankInstrumentTypes } = model;
    this.accountNatures = (accountNatures || []).map(r => new AccountNature(r));
    this.supplyNatures = (supplyNatures || []).map(r => new SupplyNature(r));
    this.banks = (banks || []).map(r => new Bank(r));
    this.bankAccountTypes = (bankAccountTypes || []).map(r => new BankAccountType(r));
    this.bankIdentifierTypes = (bankIdentifierTypes || []).map(r => new BankIdentifierType(r));
    this.paymentCardTypes = (paymentCardTypes || []).map(r => new PaymentCardType(r));
    this.bankInstrumentTypes = (bankInstrumentTypes || []).map(r => new BankInstrumentType(r));
  }
}

// Combined Payment Setup Lookup
export class PaymentSetupLookup {
  paymentProviders: PaymentProvider[];
  paymentRails: PaymentRail[];
  paymentModes: PaymentMode[];
  paymentSystemTypes: PaymentSystemType[];
  countryPaymentRails: CountryPaymentRail[];

  constructor(model: any = <any>{}) {
    const { paymentProviders, paymentRails, paymentModes, paymentSystemTypes, countryPaymentRails } = model;
    this.paymentProviders = (paymentProviders || []).map(r => new PaymentProvider(r));
    this.paymentRails = (paymentRails || []).map(r => new PaymentRail(r));
    this.paymentModes = (paymentModes || []).map(r => new PaymentMode(r));
    this.paymentSystemTypes = (paymentSystemTypes || []).map(r => new PaymentSystemType(r));
    this.countryPaymentRails = (countryPaymentRails || []).map(r => new CountryPaymentRail(r));
  }
}

// Query Options for Banking Management
export class BankQueryOptions extends CoreQueryOptions {
  countryId?: number;
  bankId?: string;
  constructor(model: any = <any>{}){ super(model); }

  override toQueryString (){
      const obj = {
          countryId: this.countryId,
          bankId: this.bankId
      };
      return this.getParamByObject(obj);
  }
}

// Query Options for Payment Management
export class PaymentQueryOptions extends CoreQueryOptions {
  countryId?: number;
  paymentRailId?: number;
  constructor(model: any = <any>{}){ super(model); }

  override toQueryString (){
      const obj = {
          countryId: this.countryId,
          paymentRailId: this.paymentRailId
      };
      return this.getParamByObject(obj);
  }
}

export class BankSerializer {
  fromJson(json: any): Bank { return new Bank(json); }
  toJson(data: any): any { return data; }
}

export class PaymentProviderSerializer {
  fromJson(json: any): PaymentProvider { return new PaymentProvider(json); }
  toJson(data: any): any { return data; }
}