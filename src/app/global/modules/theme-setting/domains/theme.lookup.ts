export class FontLookup
{
    id: number;
    name: string;
    code: string;
    constructor(model)
    {
        const { id, name, code } = model;
        this.id = id;
        this.name = name;
        this.code = code;
    }
}

class CurrencyLookup
{
    id: number;
    name: string;
    currencyCode: string;
    symbol: string;
    constructor(model)
    {
        const { id, name, currencyCode, symbol } = model;
        this.id = id;
        this.name = name;
        this.currencyCode = currencyCode;
        this.symbol = symbol;
    }
}

class LanguageLookup
{
    id: number;
    name: string;
    languageCode: string;
    cultureCode: string;
    isRTL: boolean;
    constructor(model)
    {
        const { id, name, languageCode, cultureCode, isRTL } = model;
        this.id = id;
        this.name = name;
        this.languageCode = languageCode;
        this.cultureCode = cultureCode;
        this.isRTL = isRTL;
    }
}
export class OrgThemeLookup
{
    currency: Array<CurrencyLookup>;
    language: Array<LanguageLookup>;
    constructor(model)
    {
        const { currency, language } = model;
        this.currency = (currency || []).map(r => new CurrencyLookup(r));
        this.language = (language || []).map(r => new LanguageLookup(r));
    }
}
