/**
 * Time helpers for showing and entering instants in an IANA timezone (the organisation's), independent of the
 * browser's own timezone. Uses only Intl, so DST rules come from the browser's time zone database.
 */

const formatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
    let f = formatters.get(timeZone);
    if (!f) {
        f = new Intl.DateTimeFormat('en-US', {
            timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        formatters.set(timeZone, f);
    }
    return f;
}

/** Wall-clock parts of an instant in a timezone. */
export function zonedParts(instant: Date, timeZone: string) {
    const p: Record<string, number> = {};
    for (const part of partsFormatter(timeZone).formatToParts(instant)) {
        if (part.type !== 'literal') { p[part.type] = Number(part.value); }
    }
    return {year: p['year'], month: p['month'], day: p['day'], hour: p['hour'] % 24, minute: p['minute'], second: p['second']};
}

/** Offset of the timezone from UTC at an instant, in milliseconds. */
function offsetMs(instant: Date, timeZone: string): number {
    const p = zonedParts(instant, timeZone);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - instant.getTime();
}

/** "yyyy-MM-ddTHH:mm" in the timezone → ISO instant (UTC). */
export function zonedLocalToIso(local: string, timeZone: string): string | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local ?? '');
    if (!m) { return null; }
    const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    let instant = asUtc - offsetMs(new Date(asUtc), timeZone);
    // Second pass settles times next to a DST change.
    instant = asUtc - offsetMs(new Date(instant), timeZone);
    return new Date(instant).toISOString();
}

/** ISO instant → "yyyy-MM-ddTHH:mm" in the timezone, for datetime-local inputs. */
export function isoToZonedLocal(iso: string | null | undefined, timeZone: string): string {
    if (!iso) { return ''; }
    const p = zonedParts(new Date(iso), timeZone);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/** Display an instant in a timezone, e.g. "Thu, 15 Oct 2026, 10:00". */
export function formatZoned(iso: string | null | undefined, timeZone: string, withTime = true): string {
    if (!iso) { return '—'; }
    return new Intl.DateTimeFormat('en-GB', {
        timeZone, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        ...(withTime ? {hour: '2-digit', minute: '2-digit', hourCycle: 'h23'} : {})
    }).format(new Date(iso));
}

/** Calendar day (yyyy-MM-dd) of an instant in a timezone. */
export function zonedDay(iso: string, timeZone: string): string {
    const p = zonedParts(new Date(iso), timeZone);
    return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

/** "in 3 h", "2 d ago": quick sense of urgency next to a due date. */
export function relative(iso: string | null | undefined, now = Date.now()): string {
    if (!iso) { return ''; }
    const diff = new Date(iso).getTime() - now;
    const abs = Math.abs(diff);
    const unit = abs < 3600000 ? `${Math.max(1, Math.round(abs / 60000))} min` : abs < 86400000 ? `${Math.round(abs / 3600000)} h` : `${Math.round(abs / 86400000)} d`;
    return diff >= 0 ? `in ${unit}` : `${unit} ago`;
}
