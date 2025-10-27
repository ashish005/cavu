import {ExcelGridComponent} from "./excel-grid/excel-grid.component";

import {
  CurrencyCell,
  DateFormatCell, FullDateFormatCell, NumberCell, InvoiceCurrencyCell,
  DynamicContentComponent,
  GridUISwitchCellComponent,
  NameCellComponent,
  TableComponent,
  UserAuditInfoCell, UserImageComponent
} from "./table.component";

import {PaginationComponent} from "./pagination/pagination";
import {GridGallaryComponent, ImgComponent} from "./grid-gallary/grid-gallary.component";
import {BoxToolComponent} from "./box-tool/box-tool.component";

export {
  DynamicContentComponent, DynamicComponent, GridUISwitchCellComponent,
  NameCellComponent, UserAuditInfoCell, UserImageComponent,
  CurrencyCell, NumberCell, InvoiceCurrencyCell, FullDateFormatCell,
  DateFormatCell
} from "./table.component";

export const GRID_COMPONENT = [
  ExcelGridComponent,
  TableComponent,
  DynamicContentComponent,
  PaginationComponent, GridGallaryComponent, ImgComponent, BoxToolComponent,
  UserImageComponent,
  UserAuditInfoCell,
  GridUISwitchCellComponent, NameCellComponent,
  CurrencyCell, NumberCell, InvoiceCurrencyCell, FullDateFormatCell,//DateFormatCell,
  DateFormatCell
];
