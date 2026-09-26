import {Component, OnInit} from '@angular/core';
import {
    PaymentProvider,
    PaymentRail,
    PaymentQueryOptions,
    PaymentSetupLookup,
    Bank, BankQueryOptions
} from "../domains/account.serializer";
import {
    PaymentProviderService,
    PaymentSetupResolver
} from "../services/account.service";
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";

@Component({
    templateUrl: './templates/payment-manage.html',
    styles: [`#manage_payment .modal-dialog{ width: auto;}`],
    standalone: false
})
export class PaymentManageView extends ViewExtender<PaymentProvider> implements OnInit{
    override coreState: PaymentQueryOptions = new PaymentQueryOptions();
    paymentSetup: PaymentSetupLookup;
    countries: any[] = [];
    constructor(protected override activatedRoute: ActivatedRoute,
                protected override service: PaymentProviderService,
                public apiResolver: PaymentSetupResolver
    ) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Provider Name', field: 'name'},
            {headerName: 'Code', field: 'code'},
            {headerName: 'Type', field: 'type'},
            {headerName: 'Website', field: 'website'},
            {headerName: 'Description', field: 'description'},
        ];
    }

    ngOnInit() {
      this.paymentSetup = this.apiResolver.paymentSetup;
      this.refreshGrid();
    }

    actionCb(row: PaymentProvider) {
        console.log('Edit payment provider:', row);
        // Implement payment provider edit functionality
    }

    newPaymentProvider() {
        console.log('Create new payment provider');
        // Implement payment provider creation functionality
    }

    filterByCountry(event: Event) {
        const target = event.target as HTMLSelectElement;
        const countryId = target.value ? parseInt(target.value) : undefined;
        this.coreState.countryId = countryId;
        this.refreshGrid();
    }
}