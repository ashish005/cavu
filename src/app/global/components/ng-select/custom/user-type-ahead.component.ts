import { Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import { concat, Observable, of, Subject, switchMap, catchError, debounceTime, map, distinctUntilChanged, filter, tap } from "rxjs";

import {NgSelectModule} from "@ng-select/ng-select";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CoreEndpointBase} from "../../../services";

class UserLookup {
    id: string;
    name: string;
    accountId: string;
    orgUserId: string;
    email: string;
    fName: string;
    lName: string;
    userTypeId: number;
    userId: string;
    constructor(model: any = <any>{})
    {
        const { id, name, accountId, email, fName, lName, userId, userTypeId, orgUserId } = model;
        this.id = id;
        this.name = name;
        this.accountId = accountId;
        this.email = email;

        this.fName = fName;
        this.lName = lName;
        this.userId = userId;
        this.userTypeId = userTypeId;
        this.orgUserId = orgUserId;
        this.name = `${this.fName} ${this.lName}`;
    }
}

@Component({
  selector: 'user-type-ahead',
  templateUrl: './templates/type-ahead.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
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
export class UserTypeAheadComponent extends CoreEndpointBase {
    @Input() userType: string;

    @Input() callFn: any;
    @Input() controlTitle: string;
    @Input() disabled?: boolean = false;

    @Input() multiple: boolean = false;
    @Input() bindLabel : string = "name";
    @Input() bindValue : string = "id";
    @Input() controlId: any;

    @Input() set controlValue (val)
    {
        /*if(val)
        {
            this.input$.next(val);
        } else {
            this.items$ = of([]);
        }*/
        this.hideTypeAhead = (val);
        setTimeout((v) => { this.input$.next(v); }, 100, val);
    };

    selected: UserLookup;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    public items$: Observable<UserLookup[]>;
    loading: boolean = false;
    public input$ = new Subject<string | null>();
    public minLengthTerm = 2;

    hideTypeAhead: boolean = true;
    constructor(override injector: Injector){ super(injector); }

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
      return this.httpClient.get(`${this.baseSectorAPIUrl}lookupSearch/contact/${this.userType}/${name}`, this.requestHeaders);
    }

    trackByFn(item: any) { return item.id; }

    private convertData(data: any): UserLookup[]
    {
        return (data || []).map(item => new UserLookup(item));
    }

        showSelect(){
        this.hideTypeAhead = false;
    }
}
