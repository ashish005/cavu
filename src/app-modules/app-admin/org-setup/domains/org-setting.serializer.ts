export class OrgSetting {
    id: number;

    fontId:number;
    languageId: number;
    currencyId: number;

    currencyCode: string;
    languageCode: string;

    logoDocumentId: number;

    startWeekDay:  number;

    dateFormat: string;
    dateSeparator: string;

    dateFormater: string;

    ofcStartTime: string;
    ofcEndTime: string;
    fyStartDay: number;
    fyStartMonth: number;
    fyCloseDay: number;
    fyCloseMonth: number;

    timeZone: string;

    // passwordChangeOnFirstLoginEnabled: boolean;
    //
    // hasMultipleBranch: boolean;
    //
    // hasMultipleStudyMode: boolean;
    // hasMultipleClassSection: boolean;
    // hasMultipleCourseSection: boolean;
    //
    // hasMultiProjectModule: boolean;
    // hasProjectWorkFlow: boolean;
    //
    // hasMultiCurrency: boolean;
    // hasMultiLanguage: boolean;
    constructor(model: any = <any>{})
    {
        const
            {
                id, fontId, font, currencyId, languageId, currencyCode, languageCode,
                logoDocumentId, passwordChangeOnFirstLoginEnabled,
                startWeekDay, dateFormat, dateSeparator,
                ofcStartTime, ofcEndTime, fyStartDay, fyStartMonth, fyCloseDay, fyCloseMonth, timeZone,

                // hasMultipleBranch, hasMultipleStudyMode, hasMultipleClassSection, hasMultipleCourseSection,
                // hasMultiProjectModule, hasProjectWorkFlow, hasMultiCurrency, hasMultiLanguage
            } = model;
        this.id = id;

        this.fontId = fontId;
        this.currencyId = currencyId;
        this.languageId = languageId;

        this.currencyCode = currencyCode;
        this.languageCode = languageCode;

        this.logoDocumentId = logoDocumentId;

        this.startWeekDay = startWeekDay || 1;
        this.dateFormat = dateFormat || 'dd MMM yyyy';
        this.dateSeparator = dateSeparator || '';
        this.dateFormater =  dateSeparator ? (dateFormat || '').replace(/\s/g, dateSeparator): dateFormat;

        this.ofcStartTime  = ofcStartTime || '09:00:00';
        this.ofcEndTime = ofcEndTime || '17:00:00';
        this.fyStartDay = fyStartDay || 1;
        this.fyStartMonth = fyStartMonth || 1;

        this.fyCloseDay = fyCloseDay || 31;
        this.fyCloseMonth = fyCloseMonth || 12;
        this.timeZone = timeZone || '+00:00';

        // this.passwordChangeOnFirstLoginEnabled = passwordChangeOnFirstLoginEnabled;
        //
        // this.hasMultipleBranch = hasMultipleBranch;
        // this.hasMultipleStudyMode = hasMultipleStudyMode;
        //
        // this.hasMultipleClassSection = hasMultipleClassSection;
        // this.hasMultipleCourseSection = hasMultipleCourseSection;
        //
        // this.hasMultiProjectModule = hasMultiProjectModule;
        // this.hasProjectWorkFlow = hasProjectWorkFlow;
        //
        // this.hasMultiCurrency = hasMultiCurrency;
        // this.hasMultiLanguage = hasMultiLanguage;
    }
}
export class OrgSettingSerializer {
    fromJson(json: any): OrgSetting { return new OrgSetting(json); }
    toJson(data: any): any { return data; }
}
