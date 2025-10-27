import {HighlightPipe} from "./highlight";
import {GroupByPipe} from "./group-by";
import {SafeHtmlPipe} from "./safe-html.pipe";
import {FilterPipe, SearchFilterPipe, filterFindPipe, FilterFunctionPipe} from "./filter.pipe";
import {SortByPipe} from "./sort-by.pipe";
import {PrettyPrintPipe} from "./pretty-print.pipe";
import {CORE_SETUP_PIPES} from "./app-pipes/index";
import {CurrencyPipe, DatePipe, JsonPipe} from "@angular/common";
// import {CORE_SETUP_PIPES} from "./app-pipes/index";
// import {CurrencyPipe, DatePipe} from "@angular/common";

export const GLOBAL_PIPES = [
    HighlightPipe, GroupByPipe, SafeHtmlPipe,
    FilterPipe, FilterFunctionPipe, filterFindPipe, SearchFilterPipe,
    SortByPipe,
    PrettyPrintPipe, CORE_SETUP_PIPES, DatePipe, CurrencyPipe, JsonPipe
];
