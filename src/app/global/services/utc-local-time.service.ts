import { Injectable } from '@angular/core';
export const WindowsToIanaMap: Record<string, string> = {
    "Dateline Standard Time": "Etc/GMT+12",
    "UTC-11": "Etc/GMT+11",
    "Hawaiian Standard Time": "Pacific/Honolulu",
    "Alaskan Standard Time": "America/Anchorage",
    "Pacific Standard Time (Mexico)": "America/Tijuana",
    "Pacific Standard Time": "America/Los_Angeles",
    "US Mountain Standard Time": "America/Phoenix",
    "Mountain Standard Time (Mexico)": "America/Chihuahua",
    "Mountain Standard Time": "America/Denver",
    "Central America Standard Time": "America/Guatemala",
    "Central Standard Time": "America/Chicago",
    "Easter Island Standard Time": "Pacific/Easter",
    "Central Standard Time (Mexico)": "America/Mexico_City",
    "Canada Central Standard Time": "America/Regina",
    "SA Pacific Standard Time": "America/Bogota",
    "Eastern Standard Time": "America/New_York",
    "Eastern Standard Time (Mexico)": "America/Cancun",
    "Haiti Standard Time": "America/Port-au-Prince",
    "Cuba Standard Time": "America/Havana",
    "US Eastern Standard Time": "America/Indianapolis",
    "Turks And Caicos Standard Time": "America/Grand_Turk",
    "Paraguay Standard Time": "America/Asuncion",
    "Atlantic Standard Time": "America/Halifax",
    "Venezuela Standard Time": "America/Caracas",
    "Central Brazilian Standard Time": "America/Cuiaba",
    "SA Western Standard Time": "America/La_Paz",
    "Pacific SA Standard Time": "America/Santiago",
    "Newfoundland Standard Time": "America/St_Johns",
    "Tocantins Standard Time": "America/Araguaina",
    "E. South America Standard Time": "America/Sao_Paulo",
    "SA Eastern Standard Time": "America/Cayenne",
    "Argentina Standard Time": "America/Buenos_Aires",
    "Greenland Standard Time": "America/Godthab",
    "Montevideo Standard Time": "America/Montevideo",
    "Magallanes Standard Time": "America/Punta_Arenas",
    "Saint Pierre Standard Time": "America/Miquelon",
    "Bahia Standard Time": "America/Bahia",
    "UTC-02": "Etc/GMT+2",
    "Azores Standard Time": "Atlantic/Azores",
    "Cape Verde Standard Time": "Atlantic/Cape_Verde",
    "UTC": "Etc/UTC",
    "GMT Standard Time": "Europe/London",
    "Greenwich Standard Time": "Etc/GMT",
    "Sao Tome Standard Time": "Africa/Sao_Tome",
    "Morocco Standard Time": "Africa/Casablanca",
    "W. Europe Standard Time": "Europe/Berlin",
    "Central Europe Standard Time": "Europe/Budapest",
    "Romance Standard Time": "Europe/Paris",
    "Central European Standard Time": "Europe/Warsaw",
    "W. Central Africa Standard Time": "Africa/Lagos",
    "Jordan Standard Time": "Asia/Amman",
    "GTB Standard Time": "Europe/Bucharest",
    "Middle East Standard Time": "Asia/Beirut",
    "Egypt Standard Time": "Africa/Cairo",
    "E. Europe Standard Time": "Europe/Chisinau",
    "Syria Standard Time": "Asia/Damascus",
    "West Bank Standard Time": "Asia/Hebron",
    "South Africa Standard Time": "Africa/Johannesburg",
    "FLE Standard Time": "Europe/Kiev",
    "Israel Standard Time": "Asia/Jerusalem",
    "Kaliningrad Standard Time": "Europe/Kaliningrad",
    "Sudan Standard Time": "Africa/Khartoum",
    "Libya Standard Time": "Africa/Tripoli",
    "Namibia Standard Time": "Africa/Windhoek",
    "Turkish Standard Time": "Europe/Istanbul",
    "Arab Standard Time": "Asia/Riyadh",
    "Belarus Standard Time": "Europe/Minsk",
    "Russian Standard Time": "Europe/Moscow",
    "E. Africa Standard Time": "Africa/Nairobi",
    "Iran Standard Time": "Asia/Tehran",
    "Arabian Standard Time": "Asia/Dubai",
    "Astrakhan Standard Time": "Europe/Astrakhan",
    "Azerbaijan Standard Time": "Asia/Baku",
    "Russia Time Zone 3": "Europe/Samara",
    "Mauritius Standard Time": "Indian/Mauritius",
    "Saratov Standard Time": "Europe/Saratov",
    "Georgian Standard Time": "Asia/Tbilisi",
    "Caucasus Standard Time": "Asia/Yerevan",
    "Afghanistan Standard Time": "Asia/Kabul",
    "West Asia Standard Time": "Asia/Tashkent",
    "Ekaterinburg Standard Time": "Asia/Yekaterinburg",
    "Pakistan Standard Time": "Asia/Karachi",
    "India Standard Time": "Asia/Kolkata",
    "Sri Lanka Standard Time": "Asia/Colombo",
    "Nepal Standard Time": "Asia/Kathmandu",
    "Central Asia Standard Time": "Asia/Almaty",
    "Bangladesh Standard Time": "Asia/Dhaka",
    "Omsk Standard Time": "Asia/Omsk",
    "Myanmar Standard Time": "Asia/Yangon",
    "SE Asia Standard Time": "Asia/Bangkok",
    "Altai Standard Time": "Asia/Barnaul",
    "W. Mongolia Standard Time": "Asia/Hovd",
    "North Asia Standard Time": "Asia/Krasnoyarsk",
    "N. Central Asia Standard Time": "Asia/Novosibirsk",
    "Tomsk Standard Time": "Asia/Tomsk",
    "China Standard Time": "Asia/Shanghai",
    "North Asia East Standard Time": "Asia/Irkutsk",
    "Singapore Standard Time": "Asia/Singapore",
    "W. Australia Standard Time": "Australia/Perth",
    "Taipei Standard Time": "Asia/Taipei",
    "Ulaanbaatar Standard Time": "Asia/Ulaanbaatar",
    "Aus Central W. Standard Time": "Australia/Eucla",
    "Transbaikal Standard Time": "Asia/Chita",
    "Tokyo Standard Time": "Asia/Tokyo",
    "Korea Standard Time": "Asia/Seoul",
    "Yakutsk Standard Time": "Asia/Yakutsk",
    "Cen. Australia Standard Time": "Australia/Adelaide",
    "AUS Central Standard Time": "Australia/Darwin",
    "E. Australia Standard Time": "Australia/Brisbane",
    "AUS Eastern Standard Time": "Australia/Sydney",
    "West Pacific Standard Time": "Pacific/Port_Moresby",
    "Tasmania Standard Time": "Australia/Hobart",
    "Vladivostok Standard Time": "Asia/Vladivostok",
    "Lord Howe Standard Time": "Australia/Lord_Howe",
    "Bougainville Standard Time": "Pacific/Bougainville",
    "Russia Time Zone 10": "Asia/Srednekolymsk",
    "Magadan Standard Time": "Asia/Magadan",
    "Norfolk Standard Time": "Pacific/Norfolk",
    "Sakhalin Standard Time": "Asia/Sakhalin",
    "Central Pacific Standard Time": "Pacific/Guadalcanal",
    "Russia Time Zone 11": "Asia/Kamchatka",
    "New Zealand Standard Time": "Pacific/Auckland",
    "UTC+12": "Etc/GMT-12",
    "Fiji Standard Time": "Pacific/Fiji",
    "Kamchatka Standard Time": "Asia/Kamchatka",
    "Chatham Islands Standard Time": "Pacific/Chatham",
    "UTC+13": "Etc/GMT-13",
    "Tonga Standard Time": "Pacific/Tongatapu",
    "Samoa Standard Time": "Pacific/Apia",
    "Line Islands Standard Time": "Pacific/Kiritimati"
};
export enum TimeOutputFormat {
    DATE_OBJECT = 'DATE_OBJECT',
    ISO_STRING = 'ISO_STRING',
    DATE_ONLY = 'DATE_ONLY',
    LOCAL_STRING = 'LOCAL_STRING'
}
@Injectable({ providedIn: 'root' })
export class UtcLocalTimeService {
    // -------------------------------------------------------------------
    // 2. Normalize .NET ticks → JS-compatible ISO8601
    //    Removes 7-digit ticks and appends Z
    // -------------------------------------------------------------------
    private normalizeDotNetUtc(value: string | null): string | null {
        if (!value) return null;

        // Remove 7-digit ticks → keep first 3 digits only
        value = value.replace(/\.(\d{3})\d+$/, '.$1Z');

        // If it has no timezone, assume UTC
        if (!value.endsWith('Z')) {
            value = value + 'Z';
        }
        return value;
    }

    // -------------------------------------------------------------------
    // 3. Main API → Convert UTC → Org Timezone
    // -------------------------------------------------------------------
    utcToOrgTimezone(utcValue: string | Date | null, orgTimezone: string, outputFormat: TimeOutputFormat): any {
        if (!utcValue) return null;

        // If string, normalize .NET format first
        // if (typeof utcValue === 'string') {
        //     utcValue = this.normalizeDotNetUtc(utcValue);
        //     if (!utcValue) return null;
        // }

        // Convert Windows TZ → IANA TZ
        const iana = this.toIanaTimezone(orgTimezone);

        let utcDate: Date = (utcValue instanceof Date) ? utcValue: new Date(utcValue);
        if (isNaN(utcDate.getTime())) return null;

        // Convert using Intl API
        const tzDate = this.convertUtcToTimezone(utcDate, iana);

        // Output options
        switch (outputFormat) {
            case TimeOutputFormat.DATE_OBJECT:
                return tzDate;
            case TimeOutputFormat.DATE_ONLY:
                return tzDate.toISOString().substring(0, 10);
            case TimeOutputFormat.LOCAL_STRING:
                return tzDate.toLocaleString();
            case TimeOutputFormat.ISO_STRING:
            default:
                return tzDate.toISOString();
        }
    }

    // -------------------------------------------------------------------
    // 4. Windows → IANA converter
    // -------------------------------------------------------------------
    private toIanaTimezone(tz: string): string {
        return WindowsToIanaMap[tz] || tz; // If already IANA, return as-is
    }

    // -------------------------------------------------------------------
    // 5. Safe UTC → timezone converter
    //    Uses Intl.DateTimeFormat + manual construction
    // -------------------------------------------------------------------
    private convertUtcToTimezone(utcDate: Date, ianaZone: string): Date {
        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: ianaZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23'
            });

            const parts = formatter.formatToParts(utcDate);

            const map: any = {};
            parts.forEach(p => (map[p.type] = p.value));

            const year = Number(map.year);
            const month = Number(map.month);
            const day = Number(map.day);
            const hour = Number(map.hour);
            const minute = Number(map.minute);
            const second = Number(map.second);

            return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
        } catch (err) {
            console.error('Timezone conversion error:', err);
            return utcDate; // fallback to original UTC
        }
    }
}