// Products, services and stock inside the finance workspace (api/v1/inventory/*).
export * from './inventory.models';
export * from './inventory-api.service';
export * from './inventory-cells';
export {FinanceItemsView} from './views/items.view';
export {FinanceStockView, FinanceStockMovementsView} from './views/stock.view';
export {FinanceStockDocumentsView} from './views/stock-documents.view';
export {FinanceInventoryReportsView} from './views/inventory-reports.view';
export {FinanceInventorySetupView} from './views/inventory-setup.view';
