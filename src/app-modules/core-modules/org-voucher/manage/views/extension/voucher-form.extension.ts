import {FormBuilder} from "@angular/forms";
import {Directive, Injector, TemplateRef, ViewChild} from "@angular/core";
import {VoucherForm} from "../../forms";
import {debounceTime, distinctUntilChanged, pairwise, startWith} from "rxjs";
import {ClientProject, FinancePluginLookup, LookupVoucherType, SundryType} from "../../domains/finance.lookup";
import {
    OrgLookup,
    OrgConfigOptions,
    OrgOptions,
    SchedularDomain,
    StringHelper
} from "@app-global";
import {FinanceVoucher, SundryDetail, VoucherItem} from "../../domains/finance-voucher.serializer";
import {AppSetupService, OrgLookupService} from "@app-global";

@Directive()
export class VoucherCommonFormExtender extends VoucherForm {
    public voucherLookup: FinancePluginLookup;
    protected refCreditSearchableAccounts: Array<any>;
    protected refDebitSearchableAccounts: Array<any>;

    orgActiveBranch: any;
    orgOption: OrgOptions;
    orgConfig: OrgConfigOptions;
    public orgLookup: OrgLookup;

    public systemCurrency: any;

    public isVendorVoucher: boolean;
    public voucherType: LookupVoucherType;
    public voucherTypeWithSubItems: any;

    get hasNoConversion() { return (this.formCurrencyId.value == this.systemCurrency?.id); }
    get isItemInvoice() { return !!(this.formIsItemInvoice.value); }

    constructor(public override fb: FormBuilder, public injector: Injector) {
        super(fb);
        const appSetupService = injector.get(AppSetupService);
        const orgLookupService = injector.get(OrgLookupService);
        // this.orgActiveBranch = coreService.getActiveBranch();

        const { orgConfig, options } = appSetupService.appSetup;
        this.orgOption = options;
        this.orgConfig = orgConfig;

        const orgLookup = orgLookupService.getOrgLookup();
        const { getSearchAccounts, getOrgCurrency, getVoucherTypeByMasterType, getVoucherSubItemsByMasterType, isVendorVoucher } = orgLookup;
        this.orgLookup = orgLookup;
        this.systemCurrency = orgLookup.getOrgCurrency(orgConfig.currencyCode);

        const isItemInvoiceChange = ([prev, next]: [boolean, boolean]) => {
            if (prev != next) {
                const {isPrimaryCredit, masterType} = this.voucherType;
                this.refCreditSearchableAccounts = getSearchAccounts(isPrimaryCredit, masterType, next);
                this.refDebitSearchableAccounts = getSearchAccounts(!isPrimaryCredit, masterType, next);
                this.formItems.controls.length = 0;
                this.addNewVoucherItem(new VoucherItem());
            }
        };

        const currencyCodeChange = ([prev, next]: [string, string]) => {
            if(prev != next)
            {
                const { id, symbol, currencyCode } = getOrgCurrency(next);
                this.formCurrencyId.setValue(<any>id);
                this.formCurrencySymbol.setValue(<any>symbol);
                this.formCurrencyCode.setValue(<any>currencyCode);
            }
        };

        const formVoucherMasterTypeChange = ([prev, next]: [string, string]) =>
        {
            if(prev != next)
            {
                this.voucherType = getVoucherTypeByMasterType(next);
                this.voucherTypeWithSubItems = getVoucherSubItemsByMasterType(next);
                this.isVendorVoucher = isVendorVoucher(next);
            }
        };

        this.formVoucherMasterType.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(formVoucherMasterTypeChange);
        this.formCurrencyCode.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(currencyCodeChange);
        this.formIsItemInvoice.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(isItemInvoiceChange);
    }

    private addUpdateByTaxMapperSundry(vMasterType, mapperId, value) {
        const {getTaxMapperById, sundryTypes} = this.voucherLookup;
        const {accountId, taxTypeRateId} = getTaxMapperById(mapperId) || {};
        const sundryType = sundryTypes.find(r => r.accountId == accountId);

        if (!sundryType) {
            return;
        }

        let sundryControl = this.formSundryDetails.controls.find(r => r.value.sundryTypeId == sundryType.id);

        const val = sundryControl?.value.amount || 0;
        const sd: SundryDetail = new SundryDetail({
            name: sundryType.name,
            amount: StringHelper.tillDecimalPlaces(Math.abs(val + value)),
            description: sundryType.name,
            sundryTypeId: sundryType.id,

            accountId: sundryType.accountId,
            accountGroupId: sundryType.accountGroupId,
            hasTax: sundryType.hasTax,
            // taxTypeRateId: taxTypeRateId,
            hasVoucherCredit: sundryType.hasVoucherCredit
        });

        if (sundryControl) {
            sundryControl.patchValue(sd);
        }
        else {
            this.addNewSundryDetail(sd);
        }
    }

    private addUpdateNewSundry(vMasterType, key, checkBy, value) {
        const {getSundryTypeByKeyValue, getSundryTypeByKey} = this.voucherLookup;
        let sundryType;
        if (checkBy == 'byKeyValue') {
            sundryType = getSundryTypeByKeyValue(vMasterType, key, value);
        } else if (checkBy == 'byKey') {
            sundryType = getSundryTypeByKey(vMasterType, key);
        }

        if (!sundryType) {
            return;
        }
        let sundryControl = this.formSundryDetails.controls.find(r => r.value.sundryTypeId == sundryType.id);

        const sd: SundryDetail = new SundryDetail({
            name: sundryType.name,
            amount: StringHelper.tillDecimalPlaces(Math.abs(value)),
            description: sundryType.name,
            sundryTypeId: sundryType.id,

            accountId: sundryType.accountId,
            accountGroupId: sundryType.accountGroupId,
            hasTax: sundryType.hasTax,
            //taxTypeRateId: taxTypeRateId,
            hasVoucherCredit: sundryType.hasVoucherCredit
        });
        if (sundryControl) {
            sundryControl.patchValue(sd);
        } else {
            this.addNewSundryDetail(sd);
        }
    }
}

@Directive()
export class FinancialVoucherExtension extends VoucherCommonFormExtender {
    @ViewChild('popupOptionsTemplate', {static: true}) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', {static: true}) public footerTemplate: TemplateRef<any>;
    @ViewChild('projectModule', {static: true}) projectModule;
    @ViewChild('docPrint', {static: true}) docPrint;

    @ViewChild('multiCurrencyForm', {static: true}) public multiCurrencyForm: TemplateRef<any>;
    @ViewChild('headerTitleTemplate', {static: true}) public headerTitleTemplate: TemplateRef<any>;

    projects: Array<ClientProject>;
    schedule: SchedularDomain;

    isLoading: boolean;
    submitted: boolean = false;


    constructor(public fb: FormBuilder, public injector: Injector) {
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

    scheduleData(e: SchedularDomain) { this.schedule = e; }

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

        const sundryDetails = [];
        const sundryType = this.voucherLookup.getSundryTypeByKey(voucherMasterType, 'discount');
        if(sundryType) {
            const { id, name, accountId, accountGroupId, hasTax, hasVoucherCredit }: SundryType = sundryType;
            sundryDetails.push({
                name: name,
                accountId,
                accountGroupId,
                sundryTypeId: id,
                amount: 0,
                hasTax,
                hasVoucherCredit
            });
        }
        return fVoucher;
    }
}
