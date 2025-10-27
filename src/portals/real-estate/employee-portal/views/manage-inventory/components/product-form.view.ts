import {ACTION_ENUM} from "@app-global";
import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ProductAPIResolver, ProductLookupResolver} from "../services/api.resolver";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {ProductForm} from "../forms";
import {Product} from "../domains/product.serializer";
import {CategoryLookup} from "../domains/product.lookup";

@Component({
  selector: 'product-form',
  templateUrl: './templates/product-form.html',
  styles: [`:host{ display: contents; }`],
  standalone: false
})
export class ProductFormComponent extends ProductForm implements OnInit
{
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean;
    override activeCategories: CategoryLookup[]; //for ui population

    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data(val:  Product) {
        super.populateProduct(val);
        this.onCategoryTypeChange(val?.categoryTypeId);
        this.updateCategory(val?.categoryMapper);
    }

    constructor(public override fb: FormBuilder, public service: ProductService,
                public lookupResolver: ProductLookupResolver,
                public apiResolver: ProductAPIResolver)
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
                this.apiResolver.product = resp.data;
                super.populateProduct(resp.data);
            }, ()=>{});
        } else {
            super.populateProduct(<any>{});
        }
    }

    brandCallback(e: { refresh: boolean }) { if(e.refresh){this.refreshProduct(this.id);} }
    refreshProductGrid(refresh){ this.onOk.emit({ refresh: refresh }) }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.refreshProductGrid(true);
        };
        const error = (resp)=> {
            this.submitted = false;
            this.refreshProductGrid(false);
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
// export class ProductFormComponent implements OnInit {
//     @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
//     @ViewChild('product', { static: true }) public product;
//     @Input() data: Product;
//     @Input() actionType: string;
//     @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
//     constructor(public fb: FormBuilder,
//                 public activatedRoute: ActivatedRoute,
//                 public apiResolver: ProductLookupResolver,
//                 public service: ProductService,
//                 protected sharedService: SharedService) {
//     }
//
//     ngOnInit() {}
//
//     refreshProductGrid(refresh){ this.onOk.emit(refresh); }
//     /*manageVariants() {
//         const inputData: any = {
//             id: null,
//             productId: this.id
//         };
//         const popup = {
//             header: { text: `Manage Variant`, desc: 'Manage Variant creation screen' },
//             aside: ASIDE_CLASS.RIGHT,
//             size: ASIDE_SIZE.W_75
//         };
//
//         const success = (resp: any)=>{
//             this.sharedService.destroy();
//             this.refreshProduct(this.id);
//         };
//         const failure = ()=>{
//             this.sharedService.destroy();
//             this.refreshProduct(this.id);
//         };
//
//         let modal$ = this.sharedService.showCustomPopup(ManageProductVariantCEComponent, popup, inputData);
//         modal$.then(success, failure);
//     }*/
// }

