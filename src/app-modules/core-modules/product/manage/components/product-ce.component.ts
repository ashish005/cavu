import {ProductService} from "../services/product.service";
import {ACTION_ENUM} from "@app-global";
import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ProductForm} from "../forms";
import {ProductLookupResolver} from "../../common";

@Component({
  selector: 'product-ce',
  standalone: false,
  templateUrl: './templates/product-ce.html',
  styles: [`:host { display: contents;}`]
})
export class ProductCEComponent extends ProductForm implements OnInit
{
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean;

    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data(val) { super.populateProduct(val); }

    constructor(public override fb: FormBuilder, public service: ProductService, public lookupResolver: ProductLookupResolver)
    {
        super(fb);
    }

    override onCategoryTypeChange(val)
    {
        this.activeCategories = this.lookupResolver.masterType.populateActiveCategories(val);
        super.onCategoryTypeChange(val);
    }

    ngOnInit() {
        super.formNature.valueChanges.subscribe(this.natureTypeChanges);
    }

    natureTypeChanges = (value)=>
    {
        this.productTypes = this.lookupResolver.masterType.productTypesByNature(value);
        let  activeProdType;
        if(this.activeProductType?.id){
            activeProdType = this.productTypes.find(r =>  r.id == this.activeProductType.id);
        } else {
            activeProdType = this.productTypes.find(r =>  r.isDefault == true);
        }
        super.selectedProduct(activeProdType || (this.productTypes || [])[0]);
    };

    refreshProduct(id: string){
        if(id) {
            this.service.read(this.id).toPromise().then((resp)=>
            {
                //this.apiResolver.product = resp.data;
                super.populateProduct(resp.data);
            }, ()=>{});
        } else {
            super.populateProduct(<any>{});
        }
    }

    brandCallback(e: { refresh: boolean }) { if(e.refresh){this.refreshProduct(this.id);} }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({refresh: true});
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        const data = form.getRawValue();

        data.categoryMapper = data.categoryMapper?.map(r => { return { categoryId: r }});
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, data).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(data).subscribe(success, error);
        }
    }
}
