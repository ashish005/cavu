import {Component, Directive, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from "@angular/core";

import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ParticularSearchModal} from "../../domains/particular.search";
import {debounceTime, Observable, of, switchMap} from "rxjs";
import {LookupQueryOptions} from "../payment/model/payment-mode";
import {FinanceVoucherService} from "../../services/report.service";
import {catchError, map, tap} from "rxjs";
import {CoreEndpointBase} from "@app-global";

@Directive()
class SearchPanelExtender extends CoreEndpointBase {
    particularsSearch = new FormControl();
    particularFocus: boolean = false;
    particular$: Array<ParticularSearchModal>;

    loadingParticular: boolean = false;
    particular: string;

    reportService: FinanceVoucherService;
    constructor(public override injector: Injector) {
        super(injector);
        this.reportService = injector.get(FinanceVoucherService);

        const particularRes = (entities)=> {
            this.particularFocus = true;
            this.loadingParticular = false;
            this.particular$ = (entities || []).map(r => new ParticularSearchModal(r));
        };
        this.particularsSearch.valueChanges.pipe(
            debounceTime(200),
            switchMap(particulars => {
                this.particular = particulars;
                if (particulars && particulars.length >= 2 && this.particularFocus){
                    this.loadingParticular = true;
                    return this.getByControlType('voucher', false, particulars);
                }
                return of([]);
            })
        ).subscribe(particularRes);
    }

    getByControlType(voucherMasterType, isCreditTrxn, particulars): Observable<any> {
        const q = new LookupQueryOptions();
        // q.isItemInvoice = `${!!this.isItemInvoice}`;
        // q.isCreditTrxn = `${!!this.isCreditTrxn}`;
        return this.reportService.fetchItemListByParticularName(voucherMasterType, isCreditTrxn, particulars).pipe(
            catchError(() => of([])), // empty list on error
            tap((r) => { }),
            map((resp: any) => resp.entities)
        )
    }
}

@Component({
    standalone: false,
    selector: 'product-search-panel',
    templateUrl: './product-search-panel.html'
})
export class ProductSearchPanelComponent extends SearchPanelExtender implements OnInit {
    constructor(public override injector: Injector) {
        super(injector);
    }
    ngOnInit() {}
}