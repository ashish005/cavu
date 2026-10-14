import {Pipe, PipeTransform} from "@angular/core";
import {formatZoned} from "../domains/zoned-time";

/** `{{ iso | zoned : timeZone }}` shows an instant in the given IANA timezone (dates only with `: tz : false`). */
@Pipe({name: 'zoned', standalone: false})
export class ZonedPipe implements PipeTransform {
    transform(iso: string | null | undefined, timeZone: string | null | undefined, withTime = true): string {
        return formatZoned(iso, timeZone || 'UTC', withTime);
    }
}
