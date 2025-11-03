import {CoreResource} from "@app-global";

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
            isLocked, status,
            CurrencyId, isEnabled, isDisplayed, isDefault
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

export class GlobalLanguage {
    id: number;
    name: string;
    languageCode: string;
    cultureCode: number;

    isRTL: boolean;
    symbolATRight: boolean;
    isLocked: boolean;
    status: string;
    isDeleted: boolean;

    constructor(model: any = <any>{}){
        const {
            id, name, languageCode, cultureCode,
            isRTL, symbolATRight, isLocked, status
        } = model;
        this.id = id;
        this.name = name;
        this.languageCode = languageCode;
        this.cultureCode = cultureCode;
        this.isRTL = isRTL;
        this.symbolATRight = symbolATRight;
        this.isLocked = isLocked;
        this.status = status;
    }
}
export class Country {
    id: number;
    name: string;
    countryCode: string;

    constructor(model: any = <any>{}){
        const { id, name, countryCode } = model;
        this.id = id;
        this.name = name;
    }
}

export class TimeZoneLookup {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ConfigLookup extends CoreResource {
    operatedBy: Array<any>;
    languages: Array<GlobalLanguage> = [];
    currencies: Array<GlobalCurrency> = [];
    countries: Array<Country> = [];
    timeZones: Array<TimeZoneLookup> = [];

    constructor(model: any = <any>{}){
        super();
        const { languages, currencies, countries, operatedBy, timeZones } = model;
        this.operatedBy = operatedBy;
        this.languages = (languages || []).map(r => new GlobalLanguage(r));
        this.currencies = (currencies || []).map(r => new GlobalCurrency(r));
        this.countries = (countries || []).map(r => new Country(r));
        this.timeZones = (timeZones || []).map(r => new TimeZoneLookup(r));
    }
    getCurrencyById=(id)=> (this.currencies || []).find(r => r.id == id);
    getLanguageById=(id)=> (this.languages || []).find(r => r.id == id);
}

export class ConfigLookupSerializer {
    fromJson(json: any): ConfigLookup { return new ConfigLookup(json); }
    toJson(data: any): any { return {}; }
}
