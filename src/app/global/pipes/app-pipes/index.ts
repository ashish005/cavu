import {DateFormat, DateHourMinFormat} from "./date-format.pipe";
import {VoucherCurrencyPipe, OrgCurrencyPipe} from "./currency.pipe";
import {AbsolutePipe} from "./number.pipe";

export const CORE_SETUP_PIPES = [
    DateFormat, DateHourMinFormat,
    OrgCurrencyPipe, VoucherCurrencyPipe, AbsolutePipe
];
