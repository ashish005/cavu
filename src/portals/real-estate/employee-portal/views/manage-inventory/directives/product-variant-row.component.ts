import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ProductLookupResolver} from "../services/api.resolver";
import {UnitTypeLookup} from "../domains/product.lookup";

@Component({
    selector: '[variant-row]',
    templateUrl: `./templates/variant-row.html`,
  standalone: false
})
export class ProductVariantRowComponent implements OnInit {
    @Input() customForm: FormGroup;
    activeUnitType: UnitTypeLookup;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder, public apiResolver: ProductLookupResolver) {}

  get formVariantPrices() : FormArray { return this.customForm.get('prices') as FormArray; }
  // Create a getter to cast the controls to FormGroup[]
  get priceControls(): FormGroup[] { return this.formVariantPrices.controls as FormGroup[]; }
    get formUnitTypeId(){ return this.customForm.get('unitTypeId'); }

    ngOnInit()
    {
        this.activeUnitType = this.apiResolver.masterType.unitTypes.find(r => r.id == this.formUnitTypeId.value );
    }

    selectedUnitType(item: UnitTypeLookup)
    {
        this.activeUnitType = item;
        this.formUnitTypeId.setValue(item.id);
    }

    variantPriceCallback(e: { refresh: boolean })
    {}
}
