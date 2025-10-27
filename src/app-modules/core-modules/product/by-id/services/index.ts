import {
    ProductPriceService,
    ProductByIdService,
    ProductTokenService,
    ProductVariantService
} from "./product.service";
import {ProductExtensionFactory} from "./extension.factory";

export const PRODUCT_SERVICES = [
    ProductExtensionFactory,
    ProductByIdService, ProductPriceService, ProductVariantService, ProductTokenService
];