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
    constructor(model: any = <any>{})
    {
        const
            {
                id, fontId, font, currencyId, languageId, currencyCode, languageCode,
                logoDocumentId, passwordChangeOnFirstLoginEnabled,
                startWeekDay, dateFormat, dateSeparator,
                ofcStartTime, ofcEndTime, fyStartDay, fyStartMonth, fyCloseDay, fyCloseMonth, timeZone
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
    }

    /*public get assumedStartDate() { return DateHelper.toDateControlFormat(new Date()); }
    public get assumedEndDate() {
        var d = new Date();
        var utcDate = new Date(d.getFullYear(), this.fyCloseMonth-1, this.fyCloseDay);
        return DateHelper.toDateControlFormat(utcDate);
    }*/
}
export class OrgSettingSerializer {
    fromJson(json: any): OrgSetting { return new OrgSetting(json); }
    toJson(data: any): any { return data; }
}
