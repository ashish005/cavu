import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FeeConcessionTypeService} from "../services/fee-concession.service";
import {ActivatedRoute} from "@angular/router";
import {FeeConcessionType, FeeConcessionTypeQueryOptions} from "../domains/fee-concession.serializer";
import {FeePlanLookupService} from "../services/api.resolver";
import {ViewExtender} from "@app-global";

@Component({
    standalone: false,
    selector: 'fee-concession',
    templateUrl: './templates/fee-concession.html',
    styles: [`:host{ display: contents; }`]
})
export class FeeConcessionSummaryView extends ViewExtender<FeeConcessionType> implements OnInit {
    @ViewChild('feeConcessionForm', { static: true }) public feeConcessionForm;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    loading: boolean = true;
    override coreState: FeeConcessionTypeQueryOptions = new FeeConcessionTypeQueryOptions();
    constructor(public lookupService: FeePlanLookupService,
                public override activatedRoute: ActivatedRoute, public override service: FeeConcessionTypeService) {
        super(activatedRoute, service);
    }

    ngOnInit(){
        this.populateGrid();
        this.createNew();
    }

    feeConcessionChange(data){ this.feeConcessionForm.populateData(data); }

    createNew(){ this.feeConcessionForm.populateData({ id: null }); }

    onFeeConcessionUpdate(e)
    {
        this.populateGrid();
        this.createNew();
    }
}