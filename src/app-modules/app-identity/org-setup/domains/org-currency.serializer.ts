import {CoreQueryOptions} from "@app-global";

export class OrgCurrencyQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}

export class GlobalCurrency {
    id: number;
    name: string;
    currencyCode: string;
    precision: number;
    symbol: string;
    symbolATRight: boolean;
    isLocked: boolean;
    status: string;

    constructor(model: any = <any>{}){
        const {
            id,
            name, currencyCode, precision, symbol, symbolATRight,
            isLocked, status
        } = model;
        this.id = id;
        this.name = name;
        this.currencyCode = currencyCode;
        this.precision = precision;
        this.symbol = symbol;
        this.symbolATRight = symbolATRight;
        this.isLocked = isLocked;
        this.status = status;
    }
}

export class OrgCurrency extends GlobalCurrency {
    currencyId: number;
    isEnabled: boolean;
    isDisplayed: boolean;
    isDefault: boolean;

    constructor(model: any = <any>{}){
        super(model);
        const {
            currencyId, isEnabled, isDisplayed, isDefault
        } = model;

        this.currencyId = currencyId;
        this.isEnabled = isEnabled;
        this.isDisplayed = isDisplayed;
        this.isDefault = isDefault;
    }

    public get currencyName(){
        return `${this.name} ${this.symbol}`;
    }
}

export class OrgCurrencySerializer {
  fromJson(json: any): OrgCurrency { return new OrgCurrency(json); }
  toJson(data: any): any { return data; }
}

export class GlobalCurrencySerializer {
    fromJson(json: any): GlobalCurrency { return new GlobalCurrency(json); }
    toJson(data: any): any { return data; }
}
