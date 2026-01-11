import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Component, Directive, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FinanceVoucherService} from "../../services/report.service";
import {ParticularSearchModal} from "../../domains/particular.search";
import {debounceTime, switchMap, of, catchError, map, Observable, tap} from "rxjs";
import {GatewayMapper, LookupQueryOptions} from "../payment/model/payment-mode";
import {LookupVoucherType, OrgLookupService} from "@app-global";


@Directive()
class AccountItemForm {
    @Input() customForm: FormGroup;
    @Input() voucherMasterType: string;
    /*@Input() currencyRate: number;// foreign currency rate*/
    @Input() currencyCode: string;// foreign currency symbol
    @Input() systemCurrencyCode: string; //System currency symbol
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    public get formId(){ return <FormGroup>this.customForm.get('id'); }

    get formName(){ return this.customForm.get('name'); }
    get formDesc(){ return this.customForm.get('desc'); }
    get formRemark(){ return this.customForm.get('remark'); }

    get formAccountId(): FormGroup { return <FormGroup>this.customForm.get('accountId'); }
    get formAccountGroupId(): FormGroup { return <FormGroup>this.customForm.get('accountGroupId'); }

    get formForeignAmount(): FormGroup { return <FormGroup>this.customForm.get('foreignAmount'); }
}

@Component({
    standalone: false,
    selector:'[account-item-form]',
    templateUrl: './templates/account-item-form.html',
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
export class AccountItemFormComponent extends AccountItemForm implements OnInit {
    constructor(public fb: FormBuilder, public reportService: FinanceVoucherService, public orgLookupService: OrgLookupService) {
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

        const orgLookup = this.orgLookupService.getOrgLookup();
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
    }

    getByControlType(voucherMasterType, isCreditTrxn, particulars): Observable<any> {
        const q = new LookupQueryOptions();
        q.isItemInvoice = `false`;
        q.isCreditTrxn = `${!!isCreditTrxn}`;
        return this.reportService.fetchAccountListByParticularName(this.voucherMasterType, particulars, q).pipe(
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
        const { accountId, accountGroupId, name } = data;

        this.particularsSearch.setValue(name, { emitEvent: false });

        this.formName.setValue(name, { emitEvent: false });
        this.formAccountId.setValue(<any>accountId,{ emitEvent: false });
        this.formAccountGroupId.setValue(<any>accountGroupId, { emitEvent: false });
    }

    newAccount(e: any){}
}