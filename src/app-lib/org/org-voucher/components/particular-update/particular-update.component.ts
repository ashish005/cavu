import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs";
import {of} from "rxjs";
import {catchError, switchMap, tap} from "rxjs";
import {FinanceVoucherService} from "../../services/report.service";
import {ParticularSearchModal} from "../../domains/particular.search";
import {LookupVoucherType, OrgLookupService} from "@app-global";

@Component({
  standalone: false,
  selector: 'particular-update',
  templateUrl: './particular-update.html',
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
          input#search {
              width: 100%;
          }
      }
  `]
})
export class ParticularUpdateSearch implements OnInit {
  @Input() customForm: FormGroup;
  @Input() vType: string;
  @Input() isItemInvoice: boolean;

  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  particularsSearch = new FormControl();
  particularFocus: boolean = false;
  particular$: Array<ParticularSearchModal>;

  loadingParticular: boolean = false;
  constructor(public reportService: FinanceVoucherService, public coreLookupService: OrgLookupService) {}

  public get formTaxCode(){ return this.customForm.get('taxCode'); }

  public get formId(){ return this.customForm.get('id'); }

  public get formMrp(){ return this.customForm.get('mrp'); }
  public get formPrice(){ return this.customForm.get('price'); }

  public get formTax(){ return this.customForm.get('taxRate'); }

  public get formName(){ return this.customForm.get('name'); }
  public get formDesc(){ return this.customForm.get('desc'); }

  public get formVariantName(){ return this.customForm.get('variantName'); }
  clonedName: string;
  public  get isNew(){
    return (this.clonedName != this.particularsSearch?.value);
  };

  ngOnInit(){
    this.particularFocus = false;
    this.clonedName = this.formVariantName.value;

    const orgLookup = this.coreLookupService.orgLookup;
    const voucherType: LookupVoucherType = orgLookup.getVoucherTypeByMasterType(this.vType);
    const {  isPrimaryCredit } = voucherType;

    this.particularsSearch.valueChanges.pipe(
      debounceTime(200),
      switchMap(particulars => {
        this.formVariantName.setValue(particulars);
        if (particulars && particulars.length >= 2 && this.particularFocus){
            this.loadingParticular = true;
            if(this.isItemInvoice){
                return this.reportService.fetchItemListByParticularName(this.vType, this.isItemInvoice, !!!isPrimaryCredit, particulars);
            }
            return this.reportService.fetchAccountListByParticularName(this.vType, this.isItemInvoice, !!!isPrimaryCredit, particulars);
        }
        return of({entities: []});
      })
    ).subscribe(res => {
      this.particularFocus = true;
      this.loadingParticular = false;
      this.particular$ = (res['entities'] || []).map(r => new ParticularSearchModal(r));
      //this.reportService.particularSearch$ = (res['entities'] || []).map(r => new ParticularSearchModal(r));
    });
    this.particularsSearch.setValue(this.formVariantName.value);
    //this.particularsSearch.setValue(this.formProductName.value);
  }

  applySelect(data: any) {
    this.particularFocus = false;
    this.cb.emit(data);
    this.particularsSearch.setValue(this.formName.value, { emitEvent: false });
    //this.particularsSearch.setValue(this.formProductName.value, { emitEvent: false });
  }
  newProduct(productForm){}
  newAccount(accountForm){}
}
