import {
    InventoryByProductPriceService,
    InventoryByProductService,
    InventoryService
} from "./inventory.service";
import {InventoryAPIResolver} from "./api.resolver";

export const INVENTORY_SERVICES = [
    InventoryAPIResolver,
    InventoryService, InventoryByProductService, InventoryByProductPriceService
];
