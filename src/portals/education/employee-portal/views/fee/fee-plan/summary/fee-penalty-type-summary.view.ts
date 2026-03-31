import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {FeePlanLookupService} from "../services/api.resolver";
import {FeePenaltyType, FeePenaltyTypeQueryOptions} from "../domains/fee-penalty-type.serializer";
import {FeePenaltyTypeService} from "../services/fee-penalty-type.service";
import {ViewExtender} from "@app-global";

@Component({
    standalone: false,
    selector: 'fee-penalty',
    templateUrl: './templates/fee-penalty-type.html',
    styles: [`:host{ display: contents; }`]
})
export class FeePenaltyTypeSummaryView extends ViewExtender<FeePenaltyType> implements OnInit {
    @ViewChild('feePenaltyForm', { static: true }) public feePenaltyForm;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    loading: boolean = true;
    override coreState: FeePenaltyTypeQueryOptions = new FeePenaltyTypeQueryOptions();
    constructor(public lookupService: FeePlanLookupService,
                public override activatedRoute: ActivatedRoute,
                public override service: FeePenaltyTypeService) {
        super(activatedRoute, service);
    }

    ngOnInit(){
        this.populateGrid();
        this.createNew();
    }

    feeConcessionChange(data){ this.feePenaltyForm.populateData(data); }

    createNew(){ this.feePenaltyForm.populateData({}); }

    onFeeConcessionUpdate(e)
    {
        this.populateGrid();
        this.createNew();
    }
}