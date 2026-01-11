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

import {FinanceVoucherService} from "../../services/report.service";
import { CoreEndpointBase, CoreQueryOptions, CoreResource } from "@app-global";

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
    standalone: false,
    selector: 'account-voucher-type-ahead',
    templateUrl: './voucher-type-ahead.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountTypeAheadComponent extends CoreEndpointBase implements OnInit, AfterContentChecked, AfterViewInit
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

    constructor(public override injector: Injector , private cdr: ChangeDetectorRef, public reportService: FinanceVoucherService) {
      super(injector);
    }

    ngOnInit() { this.loadUsers(); }

    onChange(e: any) { this.cb.emit(e); }

    loadUsers() {
        this.items$ = concat(
            of([]), // default items
            this.input$.pipe(
                filter(res => { return res && res.length >= this.minLengthTerm }),
                distinctUntilChanged(),
                debounceTime(200),
                tap(() => this.loading = true),
                switchMap(term => {
                    return this.getByControlType(term);
                })
            )
        );
    }

    getByControlType(name: string): Observable<any> {
        const q = new LookupQueryOptions();
        q.isItemInvoice = <any>false; //`${!!this.isItemInvoice}`;
        q.isCreditTrxn = `${!!this.isCreditTrxn}`;

        return this.reportService.fetchAccountListByParticularName(this.voucherType, name, q).pipe(
            catchError(() => of([])), // empty list on error
            tap((r) => { this.loading = false; }),
            map((resp: any) => this.convertData(resp.entities))
        );
    }

    trackByFn(item: any) { return item[this.bindValue]; }

    private convertData(data: any): UserLookup[]
    {
        return (data || []).map(item => new UserLookup(item));
    }
}