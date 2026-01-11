import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {switchMap, debounceTime, of} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../../services/report.service";

@Component({
  standalone: false,
  selector: 'finance-account-search',
  templateUrl: './templates/account-search.html',
  styles: [`
    .search-results {
      width: 280px;
      max-height: 200px;
      border: 1px solid #dedede;
      border-radius: 3px;
      box-sizing: border-box;
      overflow-y: auto;
      z-index: 6;
    }

    .search-result {
      background: white;
      padding: 10px;
    }

    .search-result:nth-child(even) {
      background: #fafafa;
    }
  `]
})
export class FinanceAccountSearchComponent implements OnInit
{
  customForm: FormGroup;
  @ViewChild('dateForm', { static: true }) dateForm: any;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  accountSearch = new FormControl();
  accountFocus: boolean = false;
  particular$: Array<any>;

  constructor(public service: ReportService, public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: ['', Validators.required],
      accountId: ['', Validators.required],
      accountGroupId: ['', Validators.required],
      head: ['', Validators.required],
      openingBalance: ['', Validators.required],
      openingBalanceDate: ['', Validators.required],
      fromDate: [''],
      toDate: [''],
    });
  }

  applySelect(data: any) {
    this.accountFocus = false;
    this.customForm.get('accountId').setValue(data.id);
    this.customForm.get('accountGroupId').setValue(data.accountGroupId);
    this.customForm.get('head').setValue(data.name);

    this.customForm.get('fromDate').setValue(this.dateForm.customForm.value.startDate);
    this.customForm.get('toDate').setValue(this.dateForm.customForm.value.endDate);

    this.onOk.emit(this.customForm.getRawValue());
  }

  dateChangeCb(dateForm: any) {
      this.customForm.get('fromDate').setValue(dateForm.startDate);
      this.customForm.get('toDate').setValue(dateForm.endDate);
      this.onOk.emit(this.customForm.getRawValue());
  }

  ngOnInit() {
    this.accountSearch.valueChanges.pipe(
      debounceTime(200),
      switchMap(particulars => {
        this.accountFocus = true;
        return (particulars.length > 2) ? this.service.fetchAccountByName(particulars):of({entities: []});
      })
    ).subscribe(res => {
      this.accountFocus = true;
      this.particular$ = res['entities'];
    });
  }
}


@Component({
  standalone: false,
  selector: 'day-cash-search',
  templateUrl: './templates/day-cash-search.html'
})
export class FinanceDayCashBookSearchComponent implements OnInit{
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dateForm', { static: true }) dateForm: ElementRef;
  customForm: FormGroup;

  constructor(public service: ReportService, public fb: FormBuilder) {
    const yesterDay = new Date();
    yesterDay.setDate(yesterDay.getDate() - 7);
    const fromDate = yesterDay;
    const toDate =  new Date();
    this.customForm = this.fb.group({
      startDate: [fromDate, Validators.required],
      endDate: [toDate, Validators.required]
    });
  }

  dateChangeCb(dateForm: any) {
    this.onOk.emit(dateForm);
  }


  ngOnInit(){
    this.onOk.emit(this.customForm.value);
  }
}
