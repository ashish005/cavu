import {BreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {
  NavListComponent,
  NavListMasterComponent,
  NavListTabComponent
} from "./nav-list/nav-list.component";
import {AvatorPicComponent} from "./avatar-pic/avator-pic.component";
import {QueryFilterComponent} from "./query-filter/query-filter.component";
import {DateTimePickerComponent} from "./date-time-picker/date-time-picker";
import {LoaderComponent} from "./loader/loader.component";
import {
  FormGroupWithErrorComponent
} from "./form-validation/custom-errors.component";

import {NG_SELECT_COMPONENTS} from "./ng-select";
import {DATE_TIME_COMPONENTS} from "./date-time-picker";
import {DUAL_LIST_COMPONENT} from "./dual-listbox";
import {GRID_COMPONENT} from "./responsive-table";
import {DropDownComponent} from "./drop-down/drop-down.component";
import {CALENDAR_COMPONENT} from "./calendars";
import {ORG_COMPONENTS} from "./org";
import {FlatSliderDropdownComponent} from "./slider-dropdown/flat-slider-dropdown.component";
import {SliderDropdownComponent} from "./slider-dropdown/slider-dropdown.component";
import {StatusCheckComponent} from "./status-check/status-check.component";

export const GLOBAL_COMPONENTS = [
  ORG_COMPONENTS,
  FormGroupWithErrorComponent,
  NavListComponent,
  BreadcrumbComponent,
  AvatorPicComponent,
  QueryFilterComponent,

  DateTimePickerComponent,
  NavListTabComponent,
  NavListMasterComponent,
  LoaderComponent,
  CALENDAR_COMPONENT,
  DropDownComponent,
  NG_SELECT_COMPONENTS,
  DATE_TIME_COMPONENTS,
  DUAL_LIST_COMPONENT,
  GRID_COMPONENT,
  FlatSliderDropdownComponent, SliderDropdownComponent,
  StatusCheckComponent
  //MasterSearchComponent, ParticularSearch, MasterTypesSettingComponent, PaymentComponent
];
