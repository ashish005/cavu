import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CalcHelper} from "@app-global";
import {FinanceVoucher, SundryDetail, VoucherItem} from "../domains/finance-voucher.serializer";

export class VoucherForm {
    customForm: FormGroup;
    //excludeItemForVoucher = ['payment', 'receipt'];

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            isItemInvoice: [false],
            enableAccounting: [false],
            enableInventory: [false],

            partyAccountId: [null, Validators.required],
            partyAccountGroupId:  [null, Validators.required],
            partyUserId:[null],
            partyName:[null], // just to show

            voucherNo: [null],// Set Internally
            voucherDate: [null],
            voucherMasterType: [null, Validators.required],

            currencyId: [null, Validators.required],
            currencyRate: [null, Validators.required],
            currencyCode: [null], //just to convert currency in voucher
            currencySymbol: [null], //just to convert currency in voucher

            systemCurrencyCode: [null, Validators.required], //just to convert system currency in voucher

            notes: [null],
            remark: [null],
            inDraft: [true],

            trxn: this.fb.group({
                gatewayAccountId: [null],
                gatewayAccountGroupId: [null],
                amount: [null],

                paymentSystemMaster: [null],
                gatewayMapperId: [null],
                modeId: [null],
                cardTypeId: [null],

                isReferenceNoRequired: [null],
                referenceNo: [null],

                balance: [null],

                discount: [{value: null, disabled: true }], // total discount
                taxAmount: [null], // total tax
                subTotal: [{value: null, disabled: true }]
                //adjustment: [{value: null, disabled: true }], // for sale purchase
            }),
            items: this.fb.array([]),
            billToBillTrxn: this.fb.array([]),
            sundryDetails: this.fb.array([]),

            partyRefDate: [null],// debit/ credit note
            partyRefNo: [null],// debit/ credit note
            // projectId: [null],
            // moduleId: [null],
            subTypeId: [null],
            isRecurringVoucher: [null],

            // refVoucherId: [null],
            refVoucherNo: [null],
            // refVoucherTypeId: [null],
            // trxnId: [null],
            // trxnTypeId: [null],
            // trxnDate: [null],
            // trxnTypeName: [null],
            // amount: [null, Validators.required], // net amount
            // payableAmount: [{value: null, disabled: true }], //just  to show on ui
            // dueAmount: [{value: null, disabled: true }], //just  to show on ui
            // isRecurringVoucher: [false],
            // scheduleId: [null],
            // trxnScheduleId: [null],
            // //orderId: [null],
            // acquisitionId: [null],
            // supplyStateId: [null],
            // packingCharge: [null],
            // deliveryCharge: [null],
            // roundingMethodId: [null],
            // rounding: [null],

            foreign: this.fb.group({
                discount: [null],
                taxAmount: [null],
                subTotal: [null],
                balance: [null], //just  to show on ui
                rounding: [null],
                amount: [null],
            })
        });
    }

    get f() { return this.customForm.controls; }

    get formIsItemInvoice (): FormGroup { return <FormGroup>this.customForm.get('isItemInvoice'); }
    get formEnableAccounting (): FormGroup { return <FormGroup>this.customForm.get('enableAccounting'); }
    get formEnableInventory (): FormGroup { return <FormGroup>this.customForm.get('enableInventory'); }

    get formPartyAccountId (): FormGroup { return <FormGroup>this.customForm.get('partyAccountId'); }
    get formPartyAccountGroupId (): FormGroup { return <FormGroup>this.customForm.get('partyAccountGroupId'); }
    get formPartyUserId (): FormGroup { return <FormGroup>this.customForm.get('partyUserId'); } // set from backend
    get formPartyName (): FormGroup { return <FormGroup>this.customForm.get('partyName'); }

    get formVoucherNo (): FormGroup { return <FormGroup>this.customForm.get('voucherNo'); }
    get formVoucherDate (): FormGroup { return <FormGroup>this.customForm.get('voucherDate'); }
    get formVoucherMasterType (): FormGroup { return <FormGroup>this.customForm.get('voucherMasterType'); }

    get formCurrencyId (): FormGroup { return <FormGroup>this.customForm.get('currencyId'); }
    get formCurrencyRate (): FormGroup { return <FormGroup>this.customForm.get('currencyRate'); }
    get formCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('currencyCode'); } // For UI
    get formCurrencySymbol (): FormGroup { return <FormGroup>this.customForm.get('currencySymbol'); } // For UI
    get formSystemCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('systemCurrencyCode'); } // For UI

    get formTrxn() { return <FormGroup>this.customForm.get('trxn'); }
    get formTrxnControl() { return (this.customForm.get('trxn') as FormGroup).controls; }

    get formForeign() { return <FormGroup>this.customForm.get('foreign'); }

    get formItems (): FormArray{ return <FormArray>this.customForm.get('items'); }
    get formBillToBillTrxn (): FormArray{ return <FormArray>this.customForm.get('billToBillTrxn'); }
    get formSundryDetails (): FormArray{ return <FormArray>this.customForm.get('sundryDetails'); }

    get formTrxnAmount() { return <FormGroup>this.formTrxn.get('amount'); }
    get formTrxnForeignAmount() { return <FormGroup>this.formForeign.get('amount'); }

    // get formProjectId (): FormGroup { return <FormGroup>this.customForm.get('projectId'); }
    // get formProjectModuleId (): FormGroup { return <FormGroup>this.customForm.get('moduleId'); }
    // get formVoucherSubTypeId (): FormGroup {return <FormGroup>this.customForm.get('subTypeId');}
    // get formTrxnTypeId (): FormGroup { return <FormGroup>this.customForm.get('trxnTypeId');}
    // get formTrxnTypeName (): FormGroup { return <FormGroup>this.customForm.get('trxnTypeName'); }
    // get formVoucherId (): FormGroup { return <FormGroup>this.customForm.get('voucherId'); }

    // get formVoucherTaxAmount (): FormGroup { return <FormGroup>this.customForm.get('taxAmount'); }
    // get formVoucherDiscount (): FormGroup { return <FormGroup>this.customForm.get('discount'); }
    // get formVoucherSubTotal (): FormGroup { return <FormGroup>this.customForm.get('subTotal'); }
    // get formVoucherAmount (): FormGroup { return <FormGroup>this.customForm.get('amount'); }
    // get formVoucherRounding (): FormGroup { return <FormGroup>this.customForm.get('rounding'); }

    // get formForeignDiscount (): FormGroup { return <FormGroup>this.customForm.get('foreign.discount'); }
    // get formForeignTax (): FormGroup { return <FormGroup>this.customForm.get('foreign.tax'); }
    // get formForeignSubTotal (): FormGroup { return <FormGroup>this.customForm.get('foreign.subTotal'); }
    // get formForeignAmount (): FormGroup { return <FormGroup>this.customForm.get('foreign.amount'); }
    // get formForeignRounding (): FormGroup { return <FormGroup>this.customForm.get('foreign.rounding'); }

    // get formVoucherPayable (): FormGroup { return <FormGroup>this.customForm.get('payableAmount'); }
    // get formForeignPayable (): FormGroup { return <FormGroup>this.customForm.get('foreign.payableAmount'); }
    //
    // get formVoucherBalance (): FormGroup { return <FormGroup>this.customForm.get('dueAmount'); }
    // get formForeignBalance (): FormGroup { return <FormGroup>this.customForm.get('foreign.dueAmount'); }

    populateVoucher(data: FinanceVoucher) {
        const {
            partyAccountId, partyAccountGroupId, partyUserId, partyName, inDraft,
            voucherNo, voucherDate, voucherMasterType,
            currencyId, currencyRate, currencyCode, currencySymbol, systemCurrencyCode,
            isItemInvoice, enableAccounting, enableInventory,
            notes, remark
        } = data;

        this.formVoucherMasterType.setValue(<any>voucherMasterType);

        this.formIsItemInvoice.setValue(<any>isItemInvoice || false);
        this.formEnableAccounting.setValue(<any>enableAccounting);
        this.formEnableInventory.setValue(<any>enableInventory);

        this.formPartyAccountId.setValue(<any>partyAccountId);
        this.formPartyAccountGroupId.setValue(<any>partyAccountGroupId);
        this.formPartyUserId.setValue(<any>partyUserId);
        this.formPartyName.setValue(<any>partyName);

        this.formVoucherNo.setValue(<any>voucherNo);
        this.formVoucherDate.setValue(<any>voucherDate);

        this.customForm.get('inDraft').setValue(inDraft);
        this.customForm.get('notes').setValue(notes);
        this.customForm.get('remark').setValue(remark);

        this.customForm.get('currencyId').setValue(currencyId, { emitEvent: false });
        this.customForm.get('currencyRate').setValue(currencyRate, { emitEvent: false });
        this.customForm.get('currencyCode').setValue(currencyCode, { emitEvent: false });
        this.customForm.get('currencySymbol').setValue(currencySymbol, { emitEvent: false });

        this.customForm.get('systemCurrencyCode').setValue(systemCurrencyCode, { emitEvent: false });

        /*const {
            subTypeId,
            name,
            trxnTypeId, trxnTypeName,
            //defaultAccountId, defaultAccountGroupId,
            subTotal, discount, taxAmount, amount,
            projectId, moduleId,
            partyRefNo, partyRefDate,
            refVoucherId, refVoucherNo, refVoucherTypeId
        } = data;*/

        const { items, billToBillTrxn, sundryDetails, trxn } = data || {};
        // Make sure to add them prior to voucher itmes and bill to bill
        /*this.customForm.get('name').setValue(name);
        this.customForm.get('trxnTypeId').setValue(trxnTypeId);
        this.customForm.get('trxnTypeName').setValue(trxnTypeName);
        this.customForm.get('subTypeId').setValue(subTypeId);
        this.customForm.get('subTotal').setValue(subTotal);
        this.customForm.get('discount').setValue(discount);
        this.customForm.get('taxAmount').setValue(taxAmount);
        this.customForm.get('amount').setValue(amount);
        this.customForm.get('partyRefNo').setValue(partyRefNo);
        this.customForm.get('partyRefDate').setValue(partyRefDate);
        this.customForm.get('refVoucherId').setValue(refVoucherId);
        this.customForm.get('refVoucherNo').setValue(refVoucherNo);
        this.customForm.get('refVoucherTypeId').setValue(refVoucherTypeId);

        this.customForm.get('projectId').setValue(projectId);
        this.customForm.get('moduleId').setValue(moduleId);*/

        this.formItems.controls.length = 0;
        this.formBillToBillTrxn.controls.length = 0;
        this.formSundryDetails.controls.length = 0;

        (items || []).map(r => { this.addNewVoucherItem(r);});
        (billToBillTrxn || []).map(r => { this.addNewBillToBillTrxn(r);});
        (sundryDetails || []).map(r => { this.addNewSundryDetail(r);});

        this.populateTrxnInfo(trxn);

        //if(!this.excludeItemForVoucher.some(r => r == voucherMasterType) && !this.formItems.controls.length)
        if(!this.formItems.controls.length)
        {
            this.addNewVoucherItem(new VoucherItem());
        }

        // if(!this.formSundryDetails.controls.length){
        //     this.addNewSundryDetail(new SundryDetail());
        // }
    }

    populateTrxnInfo(data) {
        const {
            gatewayAccountId, gatewayAccountGroupId, gatewayMapperId, modeId,
            paymentSystemMaster, cardTypeId, referenceNo, balance, amount, foreignAmount
        } = data;

        this.formTrxn.get('gatewayAccountId').setValue(gatewayAccountId);
        this.formTrxn.get('gatewayAccountGroupId').setValue(gatewayAccountGroupId);
        this.formTrxn.get('gatewayMapperId').setValue(gatewayMapperId);

        this.formTrxn.get('paymentSystemMaster').setValue(paymentSystemMaster);

        this.formTrxn.get('modeId').setValue(modeId);
        this.formTrxn.get('cardTypeId').setValue(cardTypeId);
        this.formTrxn.get('referenceNo').setValue(referenceNo);

        this.formTrxn.get('balance').setValue(balance);
        this.formTrxn.get('amount').setValue(amount);
        this.formForeign.get('amount').setValue(foreignAmount);

        const voucherMasterType = this.formVoucherMasterType.value;
        // if(this.excludeItemForVoucher.some(r => r == voucherMasterType))
        // {
        //     this.formTrxn.get('amount')
        //         .setValidators(
        //             [
        //                 Validators.required,
        //                 Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"),
        //                 Validators.min(0), Validators.max(balance)
        //             ]);
        // }
        // this.formTrxn.get('amount')
        //     .setValidators(
        //         [
        //             Validators.required,
        //             Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"),
        //             Validators.min(0), Validators.max(balance)
        //         ]);
    }

    // convenience getter for easy access to form fields
    public addNewVoucherItem(r: VoucherItem){ this.formItems.push(this.populateVoucherItems(r)); }
    public removeVoucherItem(index){ this.formItems.removeAt(index); }
    public addNewBillToBillTrxn(r: any){ this.formBillToBillTrxn.push(this.populateBillToBillTrxns(r)); }
    public addNewSundryDetail(r: SundryDetail){ this.formSundryDetails.push(this.populateSundryDetails(r)); }

    public addVoucherItem(){ this.addNewVoucherItem(new VoucherItem()); }

    populateBillToBillTrxns(data: any) {
        const {id, dueAmount, trxnAmount, voucherId, voucherTypeId, trxnVoucherId, trxnVoucherTypeId } = data;
        return this.fb.group(<any>{
            id: [id],
            dueAmount: [dueAmount || '', Validators.required],
            trxnAmount: [trxnAmount],
            trxnVoucherId: [trxnVoucherId],
            trxnVoucherTypeId: [trxnVoucherTypeId],

            voucherId: [voucherId, Validators.required],
            voucherTypeId: [voucherTypeId, Validators.required]
        });
    }

    formVoucherTaxRow(data) {
        const { id, taxMapperId, taxRate, taxAmount, isTaxInclusive, amount, discount, discountRate } = data;
        return this.fb.group(<any>{
            id: [id],
            taxMapperId: [taxMapperId],
            isTaxInclusive: [isTaxInclusive],
            taxRate: [taxRate],
            amount: [amount || 0],
            discount: [discount || 0],
            discountRate: [discountRate || 0],
            taxAmount: [taxAmount || 0],
            sampleLineTotal: [null]
        });
    }

    populateSundryDetails(data: SundryDetail){
        const {
            name, accountId, accountGroupId, isItemInvoice,
            transactionId, transactionDate,
            voucherId, voucherNo, voucherTypeId, voucherType, voucherDate, voucherMasterType,
            sundryTypeId, amount, taxRate, hasTax, taxTypeRateId, hasVoucherCredit
        } = data;
        return this.fb.group({
            name: [name || ''],
            accountId: [accountId],
            voucherId: [voucherId],
            voucherNo: [voucherNo],
            voucherTypeId: [voucherTypeId],
            voucherType: [voucherType],
            voucherMasterType: [voucherMasterType],
            voucherDate: [voucherDate],
            isItemInvoice: [isItemInvoice],
            transactionId: [transactionId],
            transactionDate: [transactionDate],
            //populated by sundry account
            sundryTypeId: [sundryTypeId], // required by sundry detail
            accountGroupId: [accountGroupId], // required by sundry detail
            amount: [amount],
            taxRate: [taxRate],
            hasTax: [hasTax],
            taxTypeRateId: [taxTypeRateId],
            hasVoucherCredit: [hasVoucherCredit]
        });
    }

    populateVoucherItems(data: VoucherItem) {
        const { id, name, desc, remark, accountId, accountGroupId, isPrimary, netAmount, foreignAmount, product } = data;
        const {
            variantId, variantName,
            voucherId, taxRate, taxCode, taxId, taxMapperId, trxnId,
            isFixedPrice,
            discount, discountRate,
            mrp, price, productId, productTypeId, quantity, taxAmount, isTaxInclusive, baseUnitTypeId
        } = product;

        const systemPrice: number = price || 0;
        const qty: number = quantity || 1;
        const appliedTaxRate: number = taxRate || 0;
        const appliedDiscountRate: number = discountRate || 0;

        const systemCurrencyWise = CalcHelper.getAmountAndTaxAmount(isTaxInclusive, systemPrice, appliedTaxRate, qty, appliedDiscountRate);

        const foreignPrice: number = systemPrice*this.formCurrencyRate.value || 0;
        const foreignCurrencyWise = CalcHelper.getAmountAndTaxAmount(isTaxInclusive, foreignPrice, appliedTaxRate, qty, appliedDiscountRate);

        const isDisabled = !!!this.formIsItemInvoice.value;

        const row = this.fb.group(<any>{
            id: [id || null],
            name: [name || null],
            desc: [desc],
            remark: [remark],

            accountId: [accountId],
            accountGroupId: [accountGroupId],
            isPrimary: [isPrimary],

            amount: [netAmount || 0],
            foreignAmount: [foreignAmount || 0], // set manually

            product: this.fb.group(<any>{
                voucherId: [voucherId],
                taxCode: [taxCode],
                taxMapperId: [taxMapperId],
                isTaxInclusive: [isTaxInclusive],
                taxId: [taxId],
                trxnId: [trxnId],

                productId: [productId],
                productTypeId:[productTypeId],
                variantId: [variantId],
                variantName: [variantName],
                baseUnitTypeId: [baseUnitTypeId],

                isFixedPrice: [isFixedPrice],
                quantity: [quantity],
                taxRate: [taxRate],
                discountRate: [discountRate || 0],

                mrp: [mrp || 0],
                price: [price || 0],

                discount: [systemCurrencyWise.discount || 0],
                taxAmount: [systemCurrencyWise.taxAmount || 0],
                subTotal: [systemCurrencyWise.totalAmount || 0],

                foreignPrice: [foreignPrice],// set manually
                foreignMRPPrice: [0],// set manually
                foreignDiscount: [foreignCurrencyWise.discount || 0],// set manually
                foreignTaxAmount: [ foreignCurrencyWise.taxAmount || 0],// set manually
                foreignSubTotal: [ foreignCurrencyWise.totalAmount || 0],// set manually
            })
        });
        return row;
    }
}
