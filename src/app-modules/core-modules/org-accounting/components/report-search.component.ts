import {AfterViewInit, Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { switchMap, Subscription, debounceTime, distinctUntilChanged, tap, of } from "rxjs";
import {AccountingAPIResolver} from "../services";
import {ActivatedRoute, Router} from "@angular/router";
import {DateHelper} from "@app-global";

@Component({
  standalone: false,
  selector: 'report-search',
  templateUrl: './templates/report-search.html',
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
export class ReportSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  customForm: FormGroup;
  submitted: boolean = false;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    particularsSearch = new FormControl();
    particularFocus: boolean = false;
    particular$: Array<any>;
    formSubscribe: Subscription;
  constructor(public fb: FormBuilder, public activatedRoute: ActivatedRoute,
              public route: Router, private service: AccountingAPIResolver) {
      const currentDate = new Date();
      const toDate = DateHelper.toDateControlFormat(currentDate);
      const fromDate = DateHelper.toDateControlFormat(currentDate.setMonth(currentDate.getMonth() - 12));
    this.customForm = this.fb.group({
        name: [null],
        accountId: [null],
        accountGroupId: [null],
        openingBalance: [''],
        openingBalanceDate: [''],
        startDate: [fromDate, Validators.required],
        endDate: [toDate, Validators.required],
    });

      this.particularsSearch.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(200),
          switchMap(particulars => {
              this.particularFocus = true;
              return (particulars?.length > 2) ? this.service.fetchAccountByName(particulars):of({entities: []});
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
      this.customForm.get('accountGroupId').setValue(data.accountGroupId);
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
