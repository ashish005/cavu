import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injectable,
    Injector,
    Input,
    Output
} from "@angular/core";
import {concat, Observable, of, Subject, catchError, debounceTime, map, switchMap, distinctUntilChanged, filter, tap } from "rxjs";
import {CommonModule} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {CoreEndpointBase} from "../../../services";

class AccountLookup {
    accountId: string;
    accountName: string;
    accountGroupId: string;
    accountGroupName: string;
    constructor(model: any = <any>{})
    {
        const { accountId, accountName, accountGroupId, accountGroupName } = model;
        this.accountId = accountId;
        this.accountName = accountName;
        this.accountGroupId = accountGroupId;
        this.accountGroupName = accountGroupName;
    }
}

@Component({
  selector: 'account-type-ahead',
  templateUrl: './templates/type-ahead.html',
  standalone: true, imports: [CommonModule, FormsModule, NgSelectModule],
  styles: [`
    .search-results {
      width: 280px;
      max-height: 200px;
      border: 1px solid #dedede;
      border-radius: 3px;
      box-sizing: border-box;
      overflow-y: auto;
      z-index: 6;
      position: absolute;
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
export class AccountTypeAheadComponent extends CoreEndpointBase {
    @Input() accountKey: string;

    @Input() callFn: any;
    @Input() controlTitle: string;
    @Input() disabled?: boolean = false;

    @Input() multiple: boolean = false;
    bindLabel : string = "accountName";
    bindValue : string = "accountId";
    @Input() controlId: any;

    @Input() set controlValue (val)
    {
        this.hideTypeAhead = (val);
        setTimeout((v) => { this.input$.next(v); }, 100, val);
    };

    selected: AccountLookup;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    public items$: Observable<AccountLookup[]>;
    loading: boolean = false;
    public input$ = new Subject<string | null>();
    minLengthTerm = 2;

    hideTypeAhead: boolean = true;
    constructor(public override injector: Injector) { super(injector); }

    ngOnInit() { this.loadUsers(); }
    onChange(e: any){ this.cb.emit(e);  }

    loadUsers() {
        this.items$ = concat(
            of([]), // default items
            this.input$.pipe(
                filter(res => { return res?.length >= this.minLengthTerm }),//res !== null && this.hideTypeAhead &&
                distinctUntilChanged(),
                debounceTime(200),
                tap(() => this.loading = true),
                switchMap(term => {
                    return this.getUsers(term).pipe(
                        catchError(() => of({entities: []})), // empty list on error
                        tap((r) => {
                            this.loading = false;
                        }),
                        map(resp => this.convertData(resp.entities)),
                    )
                })
            )
        );
    }

    getUsers(name: string): Observable<any> {
      return this.httpClient.get(`${this.baseSectorAPIUrl}account/lookup/${this.accountKey}/${name}`, this.requestHeaders);
    }

    trackByFn(item: any) { return item.id; }

    private convertData(data: any): AccountLookup[] { return (data || []).map(item => new AccountLookup(item)); }

    showSelect() { this.hideTypeAhead = false; }
}
