import {FormBuilder} from "@angular/forms";
import {Directive, Injector, TemplateRef, ViewChild} from "@angular/core";
import {VoucherForm} from "../forms";
import {debounceTime, distinctUntilChanged, pairwise, startWith} from "rxjs";
import {FinanceVoucher, SundryDetail, VoucherItem} from "../domains/finance-voucher.serializer";

@Directive()
export class FinancialVoucherExtension extends VoucherForm {
    @ViewChild('popupOptionsTemplate', {static: true}) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', {static: true}) public footerTemplate: TemplateRef<any>;
    @ViewChild('projectModule', {static: true}) projectModule;
    @ViewChild('docPrint', {static: true}) docPrint;

    @ViewChild('multiCurrencyForm', {static: true}) public multiCurrencyForm: TemplateRef<any>;
    @ViewChild('headerTitleTemplate', {static: true}) public headerTitleTemplate: TemplateRef<any>;

    //projects: Array<ClientProject>;

    isLoading: boolean;
    submitted: boolean = false;
    schedule: any;

    constructor(public override fb: FormBuilder, public override injector: Injector) {
        super(fb, injector);
        const partyAccountChange = ([prev, next]: [string, string]) => {
            if (prev != next && this.projectModule && !['payment', 'receipt', 'contra', 'journal'].includes(this.formVoucherMasterType.value)) {
                this.projectModule.syncProject(next);
            }
        };
        this.formPartyAccountId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(partyAccountChange);
    }

    particularChange(event, item) { item.get('enableParticular').setValue(event.checked); }

    /*changeClientProject(data: { parentId: any, childId: any }) {
        const {parentId, childId} = data;
        this.formProjectId.setValue(parentId);
        this.customForm.get('moduleId').setValue(childId);
    }*/

    updateByLedgerAccount(data: any) {
        const {userId, name, accountId, accountGroupId} = data || {};
        this.formPartyName.setValue(<any>name);
        this.formPartyUserId.setValue(<any>userId);

        this.formPartyAccountId.setValue(<any>accountId);
        this.formPartyAccountGroupId.setValue(<any>accountGroupId);
    }

    updateByMode(data: any) {
        const {userId, name, accountId, accountGroupId} = data || {};
        this.formPartyName.setValue(<any>name);
        this.formPartyUserId.setValue(<any>userId);

        this.formPartyAccountId.setValue(<any>accountId);
        this.formPartyAccountGroupId.setValue(<any>accountGroupId);
    }

    scheduleData(e: any) { this.schedule = e; }

    getDefaultVoucher=(voucherMasterType)=> {
        const fVoucher = new FinanceVoucher();
        const { id, currencyCode, symbol } = this.systemCurrency;// system currency, we need to
        fVoucher.currencyId = id;
        fVoucher.currencyRate = 1;
        fVoucher.currencyCode = currencyCode;
        fVoucher.currencySymbol = symbol;

        fVoucher.systemCurrencyCode = currencyCode;

        fVoucher.voucherMasterType = voucherMasterType;

        const voucherType = this.orgLookup.getVoucherTypeByMasterType(voucherMasterType);

        const { masterType, enableAccounting, enableInventory, hasItemInvoice } = voucherType;

        fVoucher.voucherMasterType = masterType;

        fVoucher.enableAccounting = enableAccounting;
        fVoucher.enableInventory = enableInventory;
        fVoucher.isItemInvoice = hasItemInvoice;

        const subType = (this.voucherTypeWithSubItems || []).find(r => r.isDefault);
        fVoucher.subTypeId = subType?.id;

        // const sundryDetails = [];
        // const sundryType = this.voucherLookup.getSundryTypeByKey(voucherMasterType, 'discount');
        // if(sundryType) {
        //     const { id, name, accountId, accountGroupId, hasTax, hasVoucherCredit } = sundryType;
        //     sundryDetails.push({
        //         name: name,
        //         accountId,
        //         accountGroupId,
        //         sundryTypeId: id,
        //         amount: 0,
        //         hasTax,
        //         hasVoucherCredit
        //     });
        // }
        return fVoucher;
    }
}