import { ProductService } from "./product.service";
import {ProductExtensionFactory} from "./extension.factory";

export {ProductExtensionFactory} from "./extension.factory";
export const PRODUCT_SERVICES = [ ProductService, ProductExtensionFactory ];