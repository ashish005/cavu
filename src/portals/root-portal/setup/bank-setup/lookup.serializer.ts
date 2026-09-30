import {CoreQueryOptions, CoreResource} from "@app-global";

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

// Combined Banking Setup Lookup
export class BankingSetupLookup extends CoreResource {
  accountNatures: AccountNature[];
  supplyNatures: SupplyNature[];
  banks: Bank[];
  bankAccountTypes: BankAccountType[];
  paymentCardTypes: PaymentCardType[];

  constructor(model: any = <any>{}) {
    super();
    const { accountNatures, supplyNatures, banks, bankAccountTypes, bankIdentifierTypes, paymentCardTypes, bankInstrumentTypes } = model;
    this.accountNatures = (accountNatures || []).map(r => new AccountNature(r));
    this.supplyNatures = (supplyNatures || []).map(r => new SupplyNature(r));
    this.banks = (banks || []).map(r => new Bank(r));
    this.bankAccountTypes = (bankAccountTypes || []).map(r => new BankAccountType(r));
    this.paymentCardTypes = (paymentCardTypes || []).map(r => new PaymentCardType(r));
  }
}

export class BankingSetupLookupSerializer {
  fromJson(json: any): BankingSetupLookup { return new BankingSetupLookup(json); }
  toJson(data: any): any { return {}; }
}