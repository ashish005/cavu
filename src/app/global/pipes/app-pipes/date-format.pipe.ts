import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";
import {AppSetupService} from "../../services/app-setup.service";

export enum UtcToLocalTimeFormat {
    FULL        = 'full',        // 'EEEE, MMMM d, y, h:mm:ss a zzzz'   - Monday, June 15, 2015 at 9:03:01 AM GMT+01:00
    SHORT       = 'short',       // 'd/M/yy, h:mm'                      - 15/6/15, 9:03
    SHORT_DATE  = 'shortDate',   // 'd/M/yy'                            - 15/6/15
    SHORT_TIME  = 'shortTime',   // 'h:mm'                              - 9:03
}

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormat implements PipeTransform {
  constructor(private datePipe: DatePipe, private setupService: AppSetupService){}
  transform(value: any): any {
    const dateFormat = this.setupService.appSetup?.dateFormat || 'MMM dd, yyyy';
    if (value) {
      if(value.length == 10){ value = value.replace(/-/g, '/'); }
      var date = value instanceof Date ? value : new Date(value);
      //var datePipe = new DatePipe('en');
      return this.datePipe.transform(date, dateFormat);//
    }
  }
}

@Pipe({ name: 'fullDateFormat', standalone: true })
export class DateHourMinFormat implements PipeTransform {
  constructor(private datePipe: DatePipe, private setupService: AppSetupService){}
  transform(value: any): any {
    const browserLanguage = navigator.language;
    const dateFormat = this.setupService.appSetup?.dateFormat || 'MMM dd, yyyy';
    const fullFormat =  dateFormat + ' hh:mm a';
    if (value) {
      //var date = value instanceof Date ? value : new Date(value);
      //var datePipe = new DatePipe('en');
      return this.datePipe.transform(this.convertUtcToLocalTime(value, UtcToLocalTimeFormat.FULL), fullFormat);//'MMM dd, yyyy hh:mm a'
    }
  }

    private convertUtcToLocalTime(
        value: any,    // UTC ISO-8601
        format: UtcToLocalTimeFormat = UtcToLocalTimeFormat.FULL
    ): string {

        var browserLanguage = navigator.language;
        const utcDate = value instanceof Date ? value : new Date(value);
        if (format === UtcToLocalTimeFormat.SHORT) {
            let date = new Date(utcDate).toLocaleDateString(browserLanguage);
            let time = new Date(utcDate).toLocaleTimeString(browserLanguage);

            return `${date}, ${time}`;
        }
        else if (format === UtcToLocalTimeFormat.SHORT_DATE) {
            return new Date(utcDate).toLocaleDateString(browserLanguage);
        }
        else if (format === UtcToLocalTimeFormat.SHORT_TIME) {
            return new Date(utcDate).toLocaleTimeString(browserLanguage);
        }
        else if (format === UtcToLocalTimeFormat.FULL) {
            return new Date(utcDate).toString();
        }
        else {
            console.error(`Do not have logic to format utc date, format:${format}`);
            return new Date(utcDate).toString();
        }
    }

    private convertLocalTimeToUtc(localDate: string):string {
        var date = new Date(localDate);
        return date.toUTCString();
    }
}

@Pipe({ name: 'tzDateFormat', standalone: true })
export class TZDateFormat implements PipeTransform {
    constructor(private datePipe: DatePipe, private setupService: AppSetupService){}
    transform(value: any): any {
        const dateFormat = this.setupService.appSetup?.dateFormat || 'MMM dd, yyyy';
        const fullFormat =  dateFormat + ' hh:mm a';
        if (value) {
            if(value.length == 10){ value = value.replace(/-/g, '/'); }
            var date = value instanceof Date ? value : new Date(value);
            //var datePipe = new DatePipe('en');
            // return this.datePipe.transform(date, dateFormat);//
            return this.datePipe.transform(this.convertUtcToLocalTime(date, UtcToLocalTimeFormat.FULL), fullFormat);//'MMM dd, yyyy hh:mm a'
        }
    }

    private convertUtcToLocalTime(
        value: any,    // UTC ISO-8601
        format: UtcToLocalTimeFormat = UtcToLocalTimeFormat.FULL
    ): string {

        var browserLanguage = navigator.language;
        const utcDate = value instanceof Date ? value : new Date(value);
        if (format === UtcToLocalTimeFormat.SHORT) {
            let date = new Date(utcDate).toLocaleDateString(browserLanguage);
            let time = new Date(utcDate).toLocaleTimeString(browserLanguage);

            return `${date}, ${time}`;
        }
        else if (format === UtcToLocalTimeFormat.SHORT_DATE) {
            return new Date(utcDate).toLocaleDateString(browserLanguage);
        }
        else if (format === UtcToLocalTimeFormat.SHORT_TIME) {
            return new Date(utcDate).toLocaleTimeString(browserLanguage);
        }
        else if (format === UtcToLocalTimeFormat.FULL) {
            return new Date(utcDate).toString();
        }
        else {
            console.error(`Do not have logic to format utc date, format:${format}`);
            return new Date(utcDate).toString();
        }
    }
}
