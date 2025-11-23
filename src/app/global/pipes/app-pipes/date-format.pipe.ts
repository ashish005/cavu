import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";
import {UtcLocalTimeService, AppSetupService, TimeOutputFormat} from "../../services";

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormat implements PipeTransform {
  constructor(private datePipe: DatePipe, private timeService: UtcLocalTimeService, private setupService: AppSetupService){}
  transform(value: any, format?: string): any {
      if (!value) return null;

      let { dateFormat, orgConfig } = this.setupService.appSetup;
      const orgTimezone = orgConfig?.timeZone;

      // Default date format
      const finalFormat = format || `${dateFormat || 'MMM dd, yyyy'}`;

      // 1️⃣ Convert UTC → Organization timezone (if available)
      const localDate = this.timeService.utcToOrgTimezone(value, orgTimezone, TimeOutputFormat.DATE_OBJECT);

      if (!localDate) return null;
      return this.datePipe.transform(localDate, finalFormat);
  }
}

@Pipe({ name: 'fullDateFormat', standalone: true })
export class DateHourMinFormat implements PipeTransform {
  constructor(private datePipe: DatePipe, private timeService: UtcLocalTimeService, private setupService: AppSetupService){}
    transform(value: any, format?: string): string | null {
        if (!value) return null;

        let { dateFormat, orgConfig } = this.setupService.appSetup;
        const orgTimezone = orgConfig?.timeZone;

        // Default date format
        const finalFormat = format || `${dateFormat || 'MMM dd, yyyy'} hh:mm`;
        const localDate = this.timeService.utcToOrgTimezone(value, orgTimezone, TimeOutputFormat.DATE_OBJECT);

        if (!localDate) return null;

        // 3️⃣ Format final output
        return this.datePipe.transform(localDate, finalFormat);
    }
}
