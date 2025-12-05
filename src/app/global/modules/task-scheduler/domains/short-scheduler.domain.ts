import {YEAR_MODE_ENUM} from "../../../enums";

export class ShortScheduler
{
    public id: number;
    public name: string;
    public yearMode: YEAR_MODE_ENUM;
    public fyStartDay: number;
    public fyStartMonth: number;
    public frequencyMasterType: number;
    public hasNoExpiration: boolean;
    public timeZone: string;
    public monthInterval: number;
    public monthNo: number;
    public dayNo: number;

    constructor(model: any = {}){
        const {
            id, name,
            yearMode, fyStartDay, fyStartMonth,
            frequencyMasterType,
            hasNoExpiration, timeZone,
            monthInterval, monthNo, dayNo
        } = model;

        this.id = id;
        this.name = name;

        this.yearMode = yearMode;
        this.fyStartDay = fyStartDay;
        this.fyStartMonth = fyStartMonth;
        this.frequencyMasterType = frequencyMasterType;
        this.hasNoExpiration = hasNoExpiration;
        this.timeZone = timeZone;

        this.monthInterval = monthInterval;
        this.monthNo = monthNo;
        this.dayNo = dayNo;
    }
}