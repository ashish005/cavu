import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter, Injector,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, filter, map, tap, concat, Observable, Subject, of, switchMap, merge} from "rxjs";
import {CoreQueryOptions, CoreResource} from "../../../services/models";
import {CoreEndpointBase} from "../../../services";
import {NgSelectModule} from "@ng-select/ng-select";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

class LookupQueryOptions extends CoreQueryOptions{
    isItemInvoice: string;
    isCreditTrxn: string;

    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            isItemInvoice:this.isItemInvoice,
            isCreditTrxn: this.isCreditTrxn
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

class UserLookup extends CoreResource {
  override id: string;
    name: string;
    companyName: string;
    address: string;
    pincode: string;

    accountId: string;
    accountGroupId: number;
    accountGroupMaster: string;

    email: string;
    phone: string;

    userId: string;
    userTypeId: number;

    orgUserId: string;
    constructor(model: any = <any>{})
    {
        super();
        const { id, name,
            accountId, accountGroupId, accountGroupMaster,

            orgUserId, email, userId, userTypeId,
            companyName, address, pincode,
        } = model;
        this.id = id;
        this.name = name;

        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.accountGroupMaster = accountGroupMaster;

        this.companyName = companyName;
        this.address = address;
        this.pincode = pincode;

        this.orgUserId = orgUserId;
        this.email = email;

        this.userId = userId;
        this.userTypeId = userTypeId;
    }
}

@Component({
    selector: 'pre-loaded-voucher-type-ahead',
    templateUrl: './templates/pre-loaded-type-ahead.html',
    standalone: true, imports: [CommonModule, FormsModule, NgSelectModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreLoadedVoucherTypeAheadComponent extends CoreEndpointBase implements OnInit, AfterContentChecked, AfterViewInit
{
    @Input() voucherType: string;
    @Input() isCreditTrxn: boolean;
    @Input() isItemInvoice: boolean;

    @Input() callFn: any;
    @Input() controlTitle: string;
    @Input() disabled?: boolean = false;

    @Input() multiple: boolean = false;
    @Input() bindLabel : string = "name";
    @Input() bindValue : string = "accountId";
    @Input() controlId: any;
    //@Input() controlValue;
    @Input() set controlValue (val) { this.input$.next(val); };

    ngAfterContentChecked(){}

    ngAfterViewInit()
    {
        //this.input$.next(this.controlValue);
        this.cdr.detectChanges();
    }

    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    loading: boolean = false;
    public items$: Observable<UserLookup[]>;
    public input$ = new Subject<string | null>();
    minLengthTerm = 1;

    constructor(public override injector: Injector , private cdr: ChangeDetectorRef) {
      super(injector);
    }

    ngOnInit() { this.loadUsers(); }

    onChange(e: UserLookup) { this.cb.emit(e); }

    loadUsers() {
        this.items$ = concat(
            of([]), // default items
            this.input$.pipe(
                filter(res => { return res && res.length >= this.minLengthTerm }),
                distinctUntilChanged(),
                debounceTime(200),
                tap(() => this.loading = true),
                switchMap(term => {
                    return this.fetchAPI(term);
                })
            )
        );
    }

    fetchAPI(term)
    {
        return this.getByControlType(term).pipe(
            catchError(() => of([])), // empty list on error
            tap((r) => { this.loading = false; }),
            map(resp => this.convertData(resp.entities))
        )
    }

    getByControlType(name: string): Observable<any> {
        const q = new LookupQueryOptions();
        q.isItemInvoice = `${!!this.isItemInvoice}`;
        q.isCreditTrxn = `${!!this.isCreditTrxn}`;
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}voucherLookup/particular/account/${this.voucherType}/${name}?${q.toQueryString()}`, this.requestHeaders)
            .pipe(
                //tap(data => this.notifyResponse(data)),
                catchError(error => this.handleError(error, () => this.getByControlType(name)))
            );
    }

    trackByFn(item: any) { return item[this.bindValue]; }

    private convertData(data: any): UserLookup[]
    {
        return (data || []).map(item => new UserLookup(item));
    }
}
