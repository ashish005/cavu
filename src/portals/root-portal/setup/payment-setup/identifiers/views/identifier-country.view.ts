import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {IdentifierTypeLookup} from "../../lookup.serializer";
import {IdentifierCountry, IdentifierCountryQueryOptions} from "../domains/identifier-country.serializer";
import {IdentifierCountryService} from "../services/identifier-country.service";

@Component({
  standalone: false,
  templateUrl: './templates/country.html',
  styles: [`:host { display: contents; }`],
})
export class IdentifierCountryView extends ViewExtender<IdentifierCountry> implements OnInit, OnDestroy {
    identifier: IdentifierTypeLookup;
    override coreState: IdentifierCountryQueryOptions = new IdentifierCountryQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: IdentifierCountryService,
                public apiResolver: PaymentSetupLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'countryName' },
            {headerName: 'Required', field: 'isRequired', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Unique', field: 'mustBeUnique', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'MinLength', field: 'minLength' },
            {headerName: 'MaxLength', field: 'maxLength' },
            {headerName: 'EffectiveFrom', field: 'effectiveFrom' },
            {headerName: 'EffectiveTo', field: 'effectiveTo' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit()
    {
        this.paramsSubscription = this.activatedRoute.parent?.params
            .subscribe((parms: { code: string }) =>
        {
            var identifierType = this.apiResolver.masterType.getIdentifierTypeByCode(parms.code);
            this.changeProvider(identifierType);
        });
    }

    changeProvider(identifier: IdentifierTypeLookup) {
        this.identifier = identifier;
        this.coreState.identifierId = this.identifier?.id;
        super.populateGrid();
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }
    actionCb(row: any){
        // const inputData: any = { id: row.id, data: row };
        // const success = ()=> {
        //     super.populateGrid();
        // };
        // this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `${row.gatewayName}`, desc: '' }, success);
    }
    createNew() {
        // const data = {
        //     systemTypeId: this.mode.systemTypeId,
        //     modeGatewayMapper: (this.modes || []).map(r => <any>{
        //         id: null,
        //         gatewayId: null,
        //         modeId: r.id,
        //         modeName: r.name,
        //         isReceiptAllowed: false,
        //         isPaymentAllowed: false,
        //         status: true,
        //     })
        // };
        // const inputData: any = { id: null, data };
        // const success = ()=> { super.populateGrid(); };
        // this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `new Gateway`, desc: '' }, success);
    }
}
