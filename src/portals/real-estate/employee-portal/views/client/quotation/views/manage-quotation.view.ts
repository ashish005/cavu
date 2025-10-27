import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
    DateFormatCell,
    InvoiceCurrencyCell,
    NumberCell,
    ViewExtender
} from "@app-global";
import {QuotationService} from "../services/quote.service";
import {Quotation, QuotationQueryOptions} from "../domains/quotation.serializer";
import {QuotePhaseChangeActionCell} from "../grid-cells/quote-grid-cell.component";

@Component({
  standalone: false,
    templateUrl: './templates/quote.html',
    providers: [QuotationService],
    styles: [`:host { display: contents;}`]
})
export class ManageQuotationView extends ViewExtender<Quotation> implements OnInit, OnDestroy {
    override coreState: QuotationQueryOptions = new QuotationQueryOptions();
    //voucherMasterType: string = VOUCHER_TYPES.QUOTATION;
    constructor(public override service: QuotationService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);

        this.gridOptions.columnDefs = [
            {headerName: 'Quotation No', field: 'voucherNo' },
            {headerName: 'Customer', field: 'partyName' },
            {headerName: 'Date', field: 'voucherDate', cellTemplate: DateFormatCell },
            {headerName: 'Sub Type', field: 'subTypeName' },
            {headerName: 'Status', cellTemplate: QuotePhaseChangeActionCell },
            {headerName: 'Amount', field: 'subTotal', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Discount', field: 'discount', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell },
            {headerName: 'TaxAmount', field: 'taxAmount', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell },
            //{headerName: 'Invoice Amount', field: 'foreignAmount', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell },
            {headerName: 'Total', field: 'netAmount', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell },
            // {headerName: 'Entry Date', field: 'entryDate', cellTemplate: FullDateFormatCell },
            // {headerName: 'Entry By', field: 'entryBy' },
        ];

        this.service.$refreshCb.subscribe(r => { super.populateGrid(); });
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: any){
        const { id} = row;
        // const inputData: any = {
        //     data: {
        //         id: id,
        //         voucherMasterType: this.voucherMasterType
        //     }
        // };
        // this.voucherFactory.showVoucherPopup(inputData, {text: `Quotation`, desc: '' }, ()=>{
        //     super.populateGrid();
        // });
    }

    createNew(){
        // const inputData: any = {
        //     data: {
        //         id: null,
        //         voucherMasterType: this.voucherMasterType
        //     }
        // };
        // this.voucherFactory.showVoucherPopup(inputData, {text: `Quotation`, desc: '' }, ()=>{
        //     super.populateGrid();
        // });
    }
}
