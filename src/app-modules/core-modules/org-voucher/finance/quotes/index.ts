// Quotations inside the finance workspace: client quotes (api/v1/sales/quotes/*) and vendor quotes (api/v1/sales/vendor-quotes/*).
export * from './quote.models';
export * from './quote-api.service';
export {FinanceQuotesView} from './views/quotes.view';
export {QuoteEditorComponent} from './views/quote-editor.component';
export {QuoteDetailComponent} from './views/quote-detail.component';
export {FinanceQuoteSettingsView} from './views/quote-settings.view';
export {FinanceVendorQuotesView} from './views/vendor-quotes.view';
export {VendorQuoteEditorComponent} from './views/vendor-quote-editor.component';
export {VendorQuoteDetailComponent} from './views/vendor-quote-detail.component';
