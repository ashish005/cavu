import {
    ProductCategoryService,
    ProductPriceService,
    ProductService,
    ProductTokenService,
    ProductVariantService
} from "./product.service";
import {ProductAPIResolver, ProductLookupResolver} from "./api.resolver";

export const PRODUCT_SERVICES =  [
    ProductAPIResolver, ProductLookupResolver,
    ProductService, ProductPriceService, ProductVariantService,
    ProductAPIResolver, ProductTokenService, ProductCategoryService
];