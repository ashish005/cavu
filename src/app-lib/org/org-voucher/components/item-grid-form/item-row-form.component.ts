import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Component, Directive, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {pairwise, startWith, debounceTime, switchMap, of, catchError, map, Observable, tap} from "rxjs";
import {FinanceVoucherService} from "../../services/report.service";
import {ParticularSearchModal} from "../../domains/particular.search";
import {LookupQueryOptions} from "../payment/model/payment-mode";
import {LookupVoucherType, StringHelper, CalcHelper, OrgLookupService} from "@app-global";

@Directive()
class ItemRowForm {
    @Input() customForm: FormGroup;
    @Input() voucherMasterType: string;
    @Input() currencyRate: number;// foreign currency rate*/
    @Input() currencyCode: string;// foreign currency symbol
    @Input() systemCurrencyCode: string; //System currency symbol
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    public get formId(){ return <FormGroup>this.customForm.get('id'); }

    get formName(){ return this.customForm.get('name'); }
    get formDesc(){ return this.customForm.get('desc'); }
    get formRemark(){ return this.customForm.get('remark'); }

    // get formAccountId() { return <FormGroup>this.customForm.get('accountId'); }
    // get formAccountGroupId() { return <FormGroup>this.customForm.get('accountGroupId'); }

    get formProduct(): FormGroup { return <FormGroup>this.customForm.get('product'); }
    get f_product() { return this.formProduct.controls; }

    get formProductIsTaxInclusive(): FormGroup { return <FormGroup>this.formProduct.get('isTaxInclusive'); }
    get formProductIsFixedPrice(): FormGroup { return <FormGroup>this.formProduct.get('isFixedPrice'); }


    get formProductTaxId(): FormGroup { return <FormGroup>this.formProduct.get('taxId'); }
    get formProductTaxCode(): FormGroup { return <FormGroup>this.formProduct.get('taxCode'); }
    get formProductTaxMapperId(): FormGroup { return <FormGroup>this.formProduct.get('taxMapperId'); }


    get formProductTrxnId(): FormGroup { return <FormGroup>this.formProduct.get('trxnId'); }
    get formProductId(): FormGroup { return <FormGroup>this.formProduct.get('productId'); }
    get formProductTypeId(): FormGroup { return <FormGroup>this.formProduct.get('productTypeId'); }
    get formProductVariantId(): FormGroup { return <FormGroup>this.formProduct.get('variantId'); }

    get formProductBaseUnitTypeId(): FormGroup { return <FormGroup>this.formProduct.get('baseUnitTypeId'); }



    get formProductMrp (): FormGroup { return <FormGroup>this.formProduct.get('mrp'); }
    get formProductPrice(): FormGroup { return <FormGroup>this.formProduct.get('price'); }
    get formProductQuantity(): FormGroup { return <FormGroup>this.formProduct.get('quantity'); }
    get formProductTaxRate (): FormGroup { return <FormGroup>this.formProduct.get('taxRate'); }
    get formProductDiscountRate (): FormGroup { return <FormGroup>this.formProduct.get('discountRate'); }

    get formProductDiscount(): FormGroup { return <FormGroup>this.formProduct.get('discount'); }
    get formProductTaxAmount(): FormGroup { return <FormGroup>this.formProduct.get('taxAmount'); }
    get formProductSubTotal(): FormGroup { return <FormGroup>this.formProduct.get('subTotal'); }

    get taxesForm(){ return <FormArray>this.formProduct.get('taxes'); } // check if needed

    //foreign currency setup: Begins
    get formProductForeignPrice() { return <FormGroup>this.formProduct.get('foreignPrice'); }
    get formProductForeignMrpPrice() { return <FormGroup>this.formProduct.get('foreignMRPPrice'); }
    get formProductForeignDiscount() { return <FormGroup>this.formProduct.get('foreignDiscount'); }
    get formProductForeignTaxAmount() { return <FormGroup>this.formProduct.get('foreignTaxAmount'); }
    get formProductForeignSubTotal() { return <FormGroup>this.formProduct.get('foreignSubTotal'); }

    get formAmount(): FormGroup { return <FormGroup>this.customForm.get('amount'); }
    get formForeignAmount() { return <FormGroup>this.customForm.get('foreignAmount'); }
}

@Component({
    standalone: false,
    selector:'[item-row-form]',
    templateUrl: './templates/voucher-item-form.html',
    styles: [`
     :ng-host input#search {
          color: inherit;
          padding: unset;
          width: 60vw;
          height: 30px !important;
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
          border: none;
          outline: none;
      }

      ul {
          background: #fff;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
         /* height: 0;*/
          overflow: hidden;
          box-shadow: 1px 2px 5px rgba(0,0,0,0.2);
          transition: .4s height;
          padding-left: 0px;
      }

      ul li {
          font-size: 12px;
          padding: 4px;
          list-style: none;
          border-top: 1px solid #ddd;
      }

      .match {
          font-weight: 600;
      }

      @media only screen and (min-width: 600px) {
          input#search { width: 100%; }
      }
      input { height: 20px; }
  `]
})
export class ItemRowFormComponent extends ItemRowForm implements OnInit {
    constructor(public fb: FormBuilder, public reportService: FinanceVoucherService, public coreLookupService: OrgLookupService) {
        super();
    }

    particularsSearch = new FormControl();
    particularFocus: boolean = false;
    particular$: Array<ParticularSearchModal>;

    loadingParticular: boolean = false;
    clonedName: string;
    public get isNew(){ return (this.clonedName != this.particularsSearch?.value); };

    ngOnInit() {
        //Particular
        this.particularFocus = false;
        this.clonedName = this.formName.value;

        const orgLookup = this.coreLookupService.getOrgLookup();
        const voucherType: LookupVoucherType = orgLookup.getVoucherTypeByMasterType(this.voucherMasterType);
        const { isPrimaryCredit } = voucherType;
        const isCreditTrxn = !!!isPrimaryCredit;

        const particularRes = (entities)=> {
            this.particularFocus = true;
            this.loadingParticular = false;
            this.particular$ = (entities || []).map(r => new ParticularSearchModal(r));
        };

        this.particularsSearch.valueChanges.pipe(
            debounceTime(200),
            switchMap(particulars => {
                this.formName.setValue(particulars);
                if (particulars && particulars.length >= 2 && this.particularFocus){
                    this.loadingParticular = true;
                    return this.getByControlType(this.voucherMasterType, isCreditTrxn, particulars);
                }
                return of([]);
            })
        ).subscribe(particularRes);
        this.particularsSearch.setValue(this.formName.value);
        //Particular: Ends

        const quantityChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                //this.calculateForMultiCurrency();
                this.cb.emit(this.customForm);
            }
        };
        this.formProductQuantity.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(quantityChange);
    }

    getByControlType(voucherMasterType, isCreditTrxn, particulars): Observable<any> {
        const q = new LookupQueryOptions();
        // q.isItemInvoice = `${!!this.isItemInvoice}`;
        // q.isCreditTrxn = `${!!this.isCreditTrxn}`;
        return this.reportService.fetchItemListByParticularName(this.voucherMasterType, isCreditTrxn, particulars).pipe(
            catchError(() => of([])), // empty list on error
            tap((r) => { }),
            map((resp: any) => resp.entities)
        )
    }

    onPriceFocusOutEvent(event)
    {
        /*const formPrice = StringHelper.tillDecimalPlaces(event.target.value*this.currencyRate);
        this.formPrice.setValue(<any>formPrice, { emitEvent: false });
        this.calculateForMultiCurrency();*/
        this.cb.emit(this.customForm);
    }

    applySelect(data: ParticularSearchModal) {
        this.particularFocus = false;
        const { name, description, mrp, price, variantId, validFrom, isTaxInclusive, isFixedPrice, isDefaultLoyalty, variant } = data;
        const {
            id, barCode, sku, isFeatured,  purchaseUnitTypeId, purchaseHoldingQty, reorderLevel, reorderQuantity, supplyTypeId, productCode,
            unitTypeId, productId, productTypeId,
            taxDetails
        } = variant;
        const { taxCode, taxMapperId, taxCategoryId, taxRate } = taxDetails;

        this.particularsSearch.setValue(name, { emitEvent: false });

        //Set Defaults first
        this.formName.setValue(name, { emitEvent: false });
        this.formDesc.setValue(description);
        this.formProductVariantId.setValue(<any>variantId, { emitEvent: false });

        this.formProductIsTaxInclusive.setValue(<any>isTaxInclusive, { emitEvent: false });
        this.formProductIsFixedPrice.setValue(<any>isFixedPrice, { emitEvent: false });

        // Set Variant
        this.formProductBaseUnitTypeId.setValue(<any>unitTypeId, { emitEvent: false });
        this.formProductId.setValue(<any>productId, { emitEvent: false });
        this.formProductTypeId.setValue(<any>productTypeId, { emitEvent: false });

        //set tax
        this.formProductTaxCode.setValue(<any>(taxCode || 'N/A'), { emitEvent: false });
        this.formProductTaxMapperId.setValue(<any>taxMapperId, { emitEvent: false });

        const _qty = 1, _currencyRate = this.currencyRate || 1, _discountRate = 0, _taxRate = taxRate || 0;

        this.formProductQuantity.setValue(<any>_qty,{ emitEvent: false });
        this.formProductDiscountRate.setValue(<any>_discountRate, { emitEvent: false });
        this.formProductTaxRate.setValue(<any>_taxRate, { emitEvent: false });

        //update local currency values
        const {discount, taxAmount, totalAmount} = CalcHelper.getAmountAndTaxAmount(isTaxInclusive, price, _taxRate, _qty, _discountRate);
        this.formProductMrp.setValue(<any>mrp);
        this.formProductPrice.setValue(<any>price);
        this.formProductDiscount.setValue(StringHelper.tillDecimalPlaces(discount));
        this.formProductTaxAmount.setValue(StringHelper.tillDecimalPlaces(taxAmount));
        this.formProductSubTotal.setValue(StringHelper.tillDecimalPlaces(totalAmount));

        const f_Price = StringHelper.tillDecimalPlaces(price * _currencyRate);
        const f_MRPPrice = StringHelper.tillDecimalPlaces(mrp * _currencyRate);
        const {discount: f_discount, taxAmount: f_taxAmount, totalAmount: f_totalAmount} = CalcHelper.getAmountAndTaxAmount(isTaxInclusive, f_Price, _taxRate, _qty, _discountRate);

        //update foreign values
        this.formProductForeignMrpPrice.setValue(f_MRPPrice);
        this.formProductForeignPrice.setValue(f_Price);
        this.formProductForeignDiscount.setValue(StringHelper.tillDecimalPlaces(f_discount));
        this.formProductForeignTaxAmount.setValue(StringHelper.tillDecimalPlaces(f_taxAmount));
        this.formProductForeignSubTotal.setValue(StringHelper.tillDecimalPlaces(f_totalAmount));

        this.cb.emit(this.customForm);//this.calculateForMultiCurrency();
    }

    updateTaxes(isChanged: boolean){
        this.cb.emit(this.customForm);//this.calculateForMultiCurrency();
    }

    newProduct(e){}
}