import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter, Injector, Input, OnDestroy,
    OnInit, Output
} from "@angular/core";
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, concat, Observable, Subject } from "rxjs";

import {FormGroup} from "@angular/forms";
import {CoreEndpointBase} from "@app-global";

@Component({
    standalone: false,
    selector: 'project-module-dropdown',
    templateUrl: './project-module-dropdown.html'
})
export class ProjectModuleDropdownComponent extends CoreEndpointBase implements OnInit, OnDestroy {
    @Input() customForm: FormGroup;

    public items$: Observable<any[]>;
    loading: boolean = false;

    get formVoucherMasterType (): FormGroup { return <FormGroup>this.customForm.get('voucherMasterType'); }
    get formProjectId (): FormGroup { return <FormGroup>this.customForm.get('projectId'); }
    get formProjectModuleId (): FormGroup { return <FormGroup>this.customForm.get('moduleId'); }

    updateProjectModule(row: any){
        this.formProjectId.setValue(row.projectId);
        this.formProjectModuleId.setValue(row.id);
    }
    updateProject(row: any){
        this.formProjectId.setValue(row.id);
        this.formProjectModuleId.reset(null);
    }

    constructor(public injector: Injector) { super(injector); }

    ngOnInit(){}
    ngOnDestroy(){}

    syncProject(accountId)
    {
        this.items$ = this.getByControlType(accountId).pipe(
            catchError(() => of({entities: []})),
            tap((r) => { this.loading = false; }),
            map(resp => this.convertData(resp.entities))
        )
    }

    private convertData(data: any): any[]
    {
        return (data || []).map(item => new any(item));
    }

    getByControlType(accountId): Observable<any>
    {
        const isVendorVoucher = ['payment', 'purchase', 'expense'].some(r => r == this.formVoucherMasterType.value);
        if(!isVendorVoucher && !accountId)
        {
            return of({entities: []});
        }
        const url: string = (!isVendorVoucher)? `project/${accountId}`: 'project-all';
        return this.httpClient.get(`${this.baseSectorAPIUrl}invoiceLookup/${url}`, this.requestHeaders);
    }
}
