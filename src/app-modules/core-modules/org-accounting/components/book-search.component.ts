import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter, Input, OnDestroy,
    OnInit,
    Output,
    ViewChild
} from "@angular/core";
import {switchMap} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { of, catchError, Observable, debounceTime, distinctUntilChanged, tap, Subscription } from "rxjs";
import {AccountingAPIResolver} from "../services";
import {DateHelper} from "@app-global";

@Component({
  standalone: false,
  selector: 'book-search',
  templateUrl: './templates/book-search.html',
  styles: [`
     input#search {
          color: inherit;
          padding: unset;
          /*width: 60vw;*/
          height: 24px !important;
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
          /*border: none;*/
          outline: none;
      }

     ul {
          background: #fff;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
         /* height: 0;
          overflow: hidden;*/
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

      .match { font-weight: 600; }
      /*@media only screen and (min-width: 600px) { input#search { width: 100%; } }*/
  `]
})
export class BookSearchComponent implements OnInit, AfterViewInit, OnDestroy{
    customForm: FormGroup;
    submitted: boolean = false;
    @Input() code: string;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    particularsSearch = new FormControl();
    particularFocus: boolean = false;
    particular$: Array<any>;
    formSubscribe: Subscription;
    constructor(public fb: FormBuilder, private service: AccountingAPIResolver) {
        const currentDate = new Date();
        const toDate = DateHelper.toDateControlFormat(currentDate);
        const fromDate = DateHelper.toDateControlFormat(currentDate.setMonth(currentDate.getMonth() - 12));

        this.customForm = this.fb.group({
            name: [null],
            accountId: [null],
            openingBalance: [''],
            openingBalanceDate: [''],
            startDate: [fromDate, Validators.required],
            endDate: [toDate, Validators.required],
        });

        this.particularsSearch.valueChanges.pipe(
            debounceTime(200),
            switchMap(particulars => {
                this.particularFocus = true;
                if (!particulars || particulars.length <= 2) { return of({ entities: [] }); }

                let apiCall$: Observable<any>;

                if (this.code === 'FIN_CASH_BOOK') {
                    apiCall$ = this.service.fetchCashAccountByName(particulars);
                } else if (this.code === 'FIN_BNK_LEDGER') {
                    apiCall$ = this.service.fetchBankAccountByName(particulars);
                } else {
                    apiCall$ = this.service.fetchAccountByName(particulars);
                }

                return apiCall$.pipe(
                    catchError(error => {
                        return of({ entities: [] }); // fallback to empty list
                    })
                );
            })
        ).subscribe(res => {
            this.particularFocus = true;
            this.particular$ = res['entities'];
        });
        /*this.formSubscribe  = this.customForm.valueChanges.pipe(
            distinctUntilChanged(),//(x, y) =>{ return x.startDate === y.startDate && x.endDate === y.endDate }
            debounceTime(400),
            tap(data => {
                //this.onOk.emit(data);
            })
        ).subscribe();*/
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formStartDate(){ return this.customForm.get('startDate'); }
    get formEndDate(){ return this.customForm.get('endDate'); }

    applySelect(data: any) {
        this.particularFocus = false;
        this.particularsSearch.reset();
        this.customForm.get('name').setValue(data.name);
        this.customForm.get('accountId').setValue(data.id);
        this.onOk.emit(this.customForm.value);
    }
    applyDateChange(){
        if(this.customForm.valid){
            this.onOk.emit(this.customForm.value);
        }
    }

    ngOnInit() {}
    ngAfterViewInit(){
        this.onOk.emit(this.customForm.value);
    }
    ngOnDestroy(){ this.formSubscribe?.unsubscribe(); }
}
