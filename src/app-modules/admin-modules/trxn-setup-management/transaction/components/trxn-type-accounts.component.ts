import {
    Component,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {BankingAPIResolver} from "../services/api.resolver";
import {TrxnTypeAllocationService} from "../services/trxn-type-allocation.service";
import {catchError, take, Subscription, throwError} from "rxjs";
import {LookupTrxnTypes} from "../domains/banking.lookup";
import {CoreEndpointBase} from "@app-global";

class Account {
    id: string;
    name: string;
    constructor(model: any = <any>{})
    {
        const { id, name }  = model;
        this.id = id;
        this.name = name;
    }
}

class TrxnTypeAccount {
    id: string;
    name: string;
    nature: string;
    accounts: Array<TrxnTypeAccount>;
    children: Array<TrxnTypeAccount>;
    isLocked: boolean;

    constructor(model: any = <any>{})
    {
        const { id, name, nature, accounts, children, isLocked }  = model;
        this.id = id;
        this.name = name;
        this.nature = nature;
        this.isLocked = isLocked;
        this.accounts = (accounts || []).map(r => new Account(r));
        this.children = (children || []).map(r => new TrxnTypeAccount(r));
    }
}

class TrxnTypeAllocation {
    id: number;
    modeTypeId: number;
    accountGroupId: number;
    accountGroupName: string;
    accountId: string;
    accountName: string;
    isDefault: boolean;
    isAllowed: boolean;
    sortNo: boolean;

    constructor(model: any = <any>{})
    {
        const { id, modeTypeId, accountGroupId, accountGroupName, accountId, accountName, isDefault, isAllowed, sortNo }  = model;
        this.id = id;
        this.modeTypeId = modeTypeId;
        this.accountGroupId = accountGroupId;
        this.accountGroupName = accountGroupName;

        this.accountId = accountId;
        this.accountName = accountName;

        this.isDefault = isDefault;
        this.isAllowed = isAllowed;
        this.sortNo = sortNo;
    }
}

@Component({
    standalone: false,
    selector: '[trxn-type]',
    templateUrl: './templates/trxn-type-accounts.html',
    styles:[`:host { display: contents; }`]
})
export class TrxnTypeAccountsComponent extends CoreEndpointBase implements OnInit, OnDestroy {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    isLoading: boolean = false;

    @Input() id: string;
    trxnType: LookupTrxnTypes;
    list: Array<any>;
    subscriber: Subscription;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override injector: Injector, public apiResolver: BankingAPIResolver){ super(injector); }

    ngOnInit() {
        this.trxnType = this.apiResolver.masterType.trxnTypes.find(r => r.id == this.id);
        this.apiResolver.refreshTrxnAlloationList.subscribe(r => {
            if(this.id == r.trxnTypeId)
            {
                this.refreshTrxn(this.id);
            }
        });
        this.refreshTrxn(this.id);
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    refreshTrxn(trxnModeId)
    {
        this.isLoading = true;
        const success = (result)=> {
            this.isLoading = false;
            this.list = result.entities.map(k => new TrxnTypeAllocation(k));
        };
        const failure = (result)=> { this.isLoading = false; };
        this.subscriber = this.getTrxnTypeAccounts(trxnModeId).subscribe(success, failure);
    }

    getTrxnTypeAccounts(trxnModeId){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}transactionTypeAllocation/${trxnModeId}`, this.requestHeaders)
            .pipe(take(1), catchError((err)=> throwError(err)));
    }
}

@Component({
    standalone: false,
    selector: 'trxn-type-allocation-list',
    templateUrl: './templates/trxn-type-allocation-list.html',
    styles:[`:host { display: contents; }`]
})
export class TrxnTypeAllocationListComponent extends CoreEndpointBase implements OnInit, OnDestroy {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean = false;
    list: Array<any>;

    isLoading: boolean;
    data: any;
    hasError: boolean;
    errorMsg: any;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    subscriber: Subscription;
    constructor(public override injector: Injector, public apiResolver: BankingAPIResolver, public service: TrxnTypeAllocationService){ super(injector); }

    ngOnInit() {
        this.callService();
    }

    ngOnDestroy(){
        this.subscriber?.unsubscribe();
    }

    apply(row, trxnType)
    {
        const success = (resp)=> {
            this.submitted = false;
            this.callService();
            this.apiResolver.refreshTrxnAlloationList.emit({ trxnTypeId: trxnType.id });
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        const data = {
            modeTypeId: trxnType.id,
            accountGroupId: row.groupId,
            accountId: row.id,
            isDefault: false,
            isAllowed: true
        };
        this.service.create(<any>data).toPromise().then(success, error);
    }

    callService(){
        this.isLoading = true;
        const success = (result)=> {
            this.isLoading = false;
            this.list = result.entities;
            this.hasError = false;
            this.errorMsg = null;
        };
        const failure = (result)=> {
            this.isLoading = false;
            this.hasError = true;
        };
        this.subscriber = this.getSummaryByType().subscribe(success, failure);
    }

    getSummaryByType(){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}transactionTypeAllocation/accounts`, this.requestHeaders)
            .pipe(take(1), catchError((err)=> throwError(err)));
    }
}
