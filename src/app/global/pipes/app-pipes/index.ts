import {DateFormat, DateHourMinFormat, TZDateFormat} from "./date-format.pipe";
import {VoucherCurrencyPipe, OrgCurrencyPipe} from "./currency.pipe";
import {AbsolutePipe} from "./number.pipe";

export const CORE_SETUP_PIPES = [
    DateFormat, DateHourMinFormat, TZDateFormat,
    OrgCurrencyPipe, VoucherCurrencyPipe, AbsolutePipe
];
