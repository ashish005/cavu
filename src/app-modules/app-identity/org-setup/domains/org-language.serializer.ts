import {CoreQueryOptions} from "@app-global";

export class OrgLanguageQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}

export class GlobalLanguage {
    id: number;
    name: string;
    languageCode: string;
    cultureCode: number;

    isRTL: boolean;
    symbolATRight: boolean;

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
    }
}

export class OrgLanguage extends GlobalLanguage {
    languageId: number;
    isDefault: boolean;
    isLocked: boolean;
    status: string;
    constructor(model: any = <any>{}){
        super(model);
        const {
            languageId, isLocked, status, isDefault
        } = model;
        this.languageId = languageId;
        this.isDefault  = isDefault;
        this.isLocked = isLocked;
        this.status = status;
    }
}

export class OrgLanguageSerializer {
  fromJson(json: any): OrgLanguage { return new OrgLanguage(json); }
  toJson(data: any): any { return data; }
}

export class GlobalLanguageSerializer {
    fromJson(json: any): GlobalLanguage { return new GlobalLanguage(json); }
    toJson(data: any): any { return data; }
}
