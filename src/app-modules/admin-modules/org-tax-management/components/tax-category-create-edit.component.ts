import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Directive,
    TemplateRef,
    ViewChild, AfterViewInit, OnDestroy
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaxCategory} from "../domains/tax-category.serializer";
import {ACTION_ENUM, SharedService} from "@app-global";
import {TaxCategoryForm} from "../forms/tax-category.form";
import {Subscription} from "rxjs";
import { TaxManagementModuleAPIResolver, TaxCategoryService } from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/tax-category-create-edit.html',
  styles: [`:host{ display: contents; }`]
})
export class TaxCategoryCreateEditComponent extends TaxCategoryForm implements OnInit, OnDestroy {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() set data(item: TaxCategory) {
    const taxType = this.apiResolver.masterType.taxTypes.filter(r => !r.parentId);
    super.mergeUpdate(taxType, item || new TaxCategory());
  };

  submitted: boolean = false;
  get actionType() { return this.id? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  filterRule = (r: any) => { return (r.value.taxGroupId == this.formTaxGroupId.value); }

  subscription: Subscription;
  constructor(public override fb: FormBuilder,
              public apiResolver: TaxManagementModuleAPIResolver,
              private service: TaxCategoryService,
              public sharedService: SharedService) {
    super(fb);
  }

  ngOnInit(): void { }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;

    const successCreation = (resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
    };

      const successUpdate = (resp: any) => {
          this.submitted = false;
          this.onOk.emit(true);
      };

    const failure = (resp: any) => { this.submitted = false; };

    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.subscription = this.service.update(this.id, form.value).subscribe(successCreation, failure);
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.subscription = this.service.create(form.value).subscribe(successUpdate, failure);
    }
  }
}
