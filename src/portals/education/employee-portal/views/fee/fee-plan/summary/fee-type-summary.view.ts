import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FeePlanLookupService} from "../services/api.resolver";
import {FeeTypeService} from "../services/fee-type.service";
import {Subscription} from "rxjs";
import {FeeType, FeeTypeQueryOptions} from "../domains/fee-type.serializer";
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";

@Component({
    standalone: false,
    selector: 'fee-type',
    templateUrl: './templates/fee-type.html',
    styles: [`:host{ display: contents; }`]
})
export class FeeTypeSummaryView extends ViewExtender<FeeType> implements OnInit, OnDestroy {
    @ViewChild('feeTypeForm', { static: true }) public feeTypeForm;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    loading: boolean = true;
    override coreState: FeeTypeQueryOptions = new FeeTypeQueryOptions();
    private subscriber: Subscription;
    constructor(public override service: FeeTypeService,  public override activatedRoute: ActivatedRoute, public lookupService: FeePlanLookupService) {
        super(activatedRoute, service);
    }

    ngOnInit(){ this.populateGrid(); this.createNew(); }

    override ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    feeTypeChange(data){
        const { id } = data;
        this.refreshFeeType(id);
    }
    createNew(){ this.feeTypeForm.updateData({ feeTaxes: [] }); }

    refreshFeeType(id){
        const success = (resp) => { this.feeTypeForm.updateData(resp.data); };
        const failure = (err)=>{};
        this.subscriber = this.service.read(id).subscribe(success, failure);
    }
}