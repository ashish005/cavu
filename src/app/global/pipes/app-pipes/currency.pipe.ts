import {CurrencyPipe} from "@angular/common";
import {Pipe, PipeTransform} from "@angular/core";
import {AppSetupService} from "../../services/app-setup.service";

class CurrencyPipeExtend {
    constructor(public currencyPipe: CurrencyPipe) { }
    transform(value: any, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): string {
        currencyCode = currencyCode || null;
        display = display || 'symbol-narrow';
        digitsInfo = digitsInfo || '1.2-2';
        locale = locale;// || 'en-US';
        if (value && 'NaN' != value && !Number.isNaN(value)) {
            return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
        }
        return '--';
        //return this.currencyPipe.transform(0, currencyCode, display, locale).split('0.00')[0];
    }
}

@Pipe({ name: 'voucherCurrency', standalone: true })
export class VoucherCurrencyPipe extends CurrencyPipeExtend implements PipeTransform {
    constructor(override currencyPipe: CurrencyPipe) { super(currencyPipe); }
    override transform(value: number, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): string {
        return super.transform(value, currencyCode, display, digitsInfo, locale);
    }
}

@Pipe({ name: 'orgCurrency', standalone: true })
export class OrgCurrencyPipe extends CurrencyPipeExtend implements PipeTransform {
    constructor(override currencyPipe: CurrencyPipe, private setupService: AppSetupService) { super(currencyPipe); }
    override transform(value: number, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): string {
        currencyCode = this.setupService.appSetup.orgConfig.currencyCode;
        return super.transform(value, currencyCode, display, digitsInfo, locale);
    }
}
