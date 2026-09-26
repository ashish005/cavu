import {Component, OnInit} from '@angular/core';
import {Bank, BankQueryOptions, BankingSetupLookup} from "../domains/account.serializer";
import {BankService, BankingSetupResolver} from "../services/account.service";
import {ActivatedRoute} from "@angular/router";
import {DateFormatCell, ViewExtender} from "@app-global";

@Component({
    templateUrl: './templates/banking-manage.html',
    styles: [`#manage_banking .modal-dialog{ width: auto;}`],
    standalone: false
})
export class BankingManageView extends ViewExtender<Bank> implements OnInit{
    override coreState: BankQueryOptions = new BankQueryOptions();
    bankingSetup: BankingSetupLookup;
    countries: any[] = [];
    constructor(protected override activatedRoute: ActivatedRoute,
                protected override service: BankService,
                public apiResolver: BankingSetupResolver
    ) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Bank Name', field: 'name'},
            {headerName: 'Code', field: 'code'},
            {headerName: 'BIC', field: 'bic'},
            {headerName: 'Country ID', field: 'countryId'},
            {headerName: 'Central Bank', field: 'isCentralBank'},
            {headerName: 'Commercial Bank', field: 'isCommercialBank'},
            {headerName: 'Cooperative', field: 'isCooperative'},
        ];
    }

    ngOnInit() {
      this.bankingSetup = this.apiResolver.bankingSetup;
      this.refreshGrid();
    }

    actionCb(row: Bank) {
        console.log('Edit bank:', row);
        // Implement bank edit functionality
    }

    newBank() {
        console.log('Create new bank');
        // Implement bank creation functionality
    }

    filterByCountry(event: Event) {
        const target = event.target as HTMLSelectElement;
        const countryId = target.value ? parseInt(target.value) : undefined;
        this.coreState.countryId = countryId;
        this.refreshGrid();
    }
}