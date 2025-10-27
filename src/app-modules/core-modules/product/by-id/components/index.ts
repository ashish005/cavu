import {ProductVariantCEComponent} from "./product-variant-ce.component";
import {ManageProductVariantCEComponent} from "./manage-variant-ce.component";

import {DashboardSummaryComponent} from "./dashboard-summary.component";
import {ProductCEComponent} from "./product-ce.component";
import {ProductTokenCEComponent} from "./product-token-ce.component";
import {ProductFormComponent} from "./product-form.view";
import {AddBrandComponent} from "./popover/add-brand.component";
import {AddVariantPriceComponent} from "./popover/add-price.component";
import {AddVariantComponent} from "./popover/add-variant.component";

export const PRODUCT_ENTRY_COMPONENTS = [
    // popover
    AddBrandComponent, AddVariantPriceComponent, AddVariantComponent
];

export const PRODUCT_COMPONENTS = [
    ProductCEComponent, ProductVariantCEComponent,
    ManageProductVariantCEComponent,
    DashboardSummaryComponent,
    ProductTokenCEComponent,
    ProductFormComponent
];
