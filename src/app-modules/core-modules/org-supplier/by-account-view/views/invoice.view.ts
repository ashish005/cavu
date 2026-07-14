/*
import {Component, Directive, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CoreQueryOptions, OrgResourceService, ViewExtender} from "@app-global";

@Directive()
export class VoucherViewExtender<T> extends ViewExtender<T> implements OnInit, OnDestroy
{
    voucherType : any;
    constructor(public coreState: CoreQueryOptions,
                public activatedRoute: ActivatedRoute,
                public service: OrgResourceService<any>,
                public pluginFactory: PluginFactory){
        super(coreState, activatedRoute, service);
        const { data, parent} = this.activatedRoute.snapshot;
        /!*this.id = parent.params.id;
        this.paramsSubscription = this.activatedRoute.parent.params.subscribe((data: any) =>{
            this.id = data.id;
            setTimeout(()=>{ this.populateGrid(); }, 100);
        });*!/
    }

    partyAccountId: string;
    vendorId: string;
    voucherMasterType: string;

    ngOnInit(){
        const { data, parent } = this.activatedRoute.snapshot;
        const { vMasterType } = data;
        this.voucherMasterType = vMasterType;

        const { accountId, vendorId} = parent?.data.item.data;
        this.partyAccountId = accountId;
        this.vendorId = vendorId;
        (<any>this.coreState).partyAccountId = this.partyAccountId;
        (<any>this.coreState).vendorId = this.vendorId;
        super.populateGrid();
    }

    ngOnDestroy(){
        super.ngOnDestroy();
    }

    actionCb(row: any){
        const { voucherType, voucherMasterType, id, voucherTypeId } = row;

        const dataItem = {
            data: {
                voucherMasterType: voucherMasterType,
                voucherType: voucherType,
                voucherId: id,
                voucherTypeId: voucherTypeId,
                // projectId: this.projectId,
                // customerId: this.clientId
            }
        };
        this.showFinanceVoucher(dataItem, { text: `${voucherType}`, desc: '' });
    }

    onNewVoucherClick(voucherType: any)
    {
        const { name, masterType, id } = voucherType;
        const dataItem = {
            data: {
                voucherMasterType: masterType,
                voucherType: name,
                voucherId: null,
                voucherTypeId: id,
                // projectId: this.projectId,
                // customerId: this.clientId
            }
        };

        this.showFinanceVoucher(dataItem, { text: `New ${name}`, desc: '' });
    }

    addNew(){
        const { name, masterType, id } = <any>this.voucherType;
        const dataItem = {
            data: {
                voucherMasterType: masterType,
                voucherType: name,
                voucherId: null,
                voucherTypeId: id,
                // projectId: this.projectId,
                // customerId: this.clientId
            }
        };

        this.showFinanceVoucher(dataItem, { text: `New ${name}`, desc: '' });
    }

    showFinanceVoucher(dataItem, header){
        const onSuccess = (resp)=> { this.pluginFactory.destroy(); this.populateGrid(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showVoucherReportPopup(dataItem, header).then(onSuccess, onFailure);
    }
}

// @Component({ templateUrl: './templates/default-voucher-view.html' })
// export class InvoiceView extends VoucherViewExtender<Invoice> implements OnInit{
//     constructor(public activatedRoute: ActivatedRoute, public service: InvoiceService, public pluginFactory: PluginFactory) {
//         super(new InvoiceQueryOptions(), activatedRoute, service, pluginFactory);
//         this.gridOptions.columnDefs = [
//             {headerName: 'party', field: 'partyName'},
//             {headerName: 'voucherNo', field: 'voucherNo'},
//             {headerName: 'voucherDate', field: 'voucherDate', cellTemplate: DateFormatCell},//, cellFn: rowData => {return this.coreService.customDate(rowData.invoiceDate)}
//             {headerName: 'type', field: 'voucherType'},
//             //{headerName: 'Order No', field: 'orderNo' },
//             //{headerName: 'Order Date', field: 'orderDate', cellTemplate: FullDateFormatCell },
//             {headerName: 'voucherTotal', field: 'netAmount', class: 'text-right', cellTemplate: NumberCell},
//             {headerName: '', field: '', class: 'text-right', cellTemplate: VoucherSaleReceiptActionCell }
//             //{headerName: 'Discount', field: 'discountAmount', class: 'text-right', cellTemplate: NumberCell }
//         ];
//
//     }
//
//     ngOnInit(){ super.ngOnInit(); }
// }

/!*@Component({ templateUrl: './templates/default-voucher-view.html' })
export class QuotationView extends VoucherViewExtender<Quotation> implements OnInit{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public service: QuotationService,
                public pluginFactory: PluginFactory) {
        super(new QuotationQueryOptions(), activatedRoute, service, pluginFactory);
        this.gridOptions.columnDefs = [
            {headerName: 'Party', field: 'party', cellFn: rowData => `${rowData.party.name}`},
            {headerName: 'Quote No / Type', cellFn: rowData => `${rowData.quotationNo} / ${rowData.quotationType}` },
            {headerName: 'Date', field: 'date', cellTemplate: FullDateFormatCell },//, cellFn: rowData => {return this.coreService.customDate(rowData.date)}
            {headerName: 'Project / Code', field: 'projectName', cellFn: rowData => `${rowData.projectName} / ${rowData.code}` },
            {headerName: 'Client', field: 'client'},
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Status', field: 'status' }
        ];
    }

    ngOnInit(){ super.ngOnInit(); }
}

@Component({ templateUrl: './templates/default-voucher-view.html' })
export class ReceiptView extends VoucherViewExtender<Receipt> implements OnInit{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public service: ReceiptService,
                public pluginFactory: PluginFactory) {
        super(new ReceiptQueryOptions(), activatedRoute, service, pluginFactory);
        this.gridOptions.columnDefs = [
            {headerName: 'Party', field: 'party.name', cellFn: rowData => `${rowData.party.name}`},
            {headerName: 'Invoice No', field: 'voucherNo'},
            {headerName: 'Invoice Date', field: 'date', cellTemplate: FullDateFormatCell},//, cellFn: rowData => {return this.coreService.customDate(rowData.invoiceDate)}
            {headerName: 'Voucher', field: 'voucherType'},
            //{headerName: 'Order No', field: 'orderNo' },
            //{headerName: 'Order Date', field: 'orderDate', cellTemplate: FullDateFormatCell },
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellTemplate: NumberCell},
            //{headerName: 'Discount', field: 'discountAmount', class: 'text-right', cellTemplate: NumberCell }
        ];
    }

    ngOnInit(){ super.ngOnInit(); }
}*!/
/!*@Component({ templateUrl: './templates/default-voucher-view.html' })
export class PaymentView extends VoucherViewExtender<Payment> implements OnInit{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public service: PaymentService,
                public pluginFactory: PluginFactory) {
        super(new PaymentQueryOptions(), activatedRoute, service, pluginFactory);
        this.gridOptions.columnDefs = [
            {headerName: 'Party', field: 'party.name', cellFn: rowData => `${rowData.party.name}`},
            {headerName: 'Invoice No', field: 'voucherNo'},
            {headerName: 'Invoice Date', field: 'date', cellTemplate: FullDateFormatCell},//, cellFn: rowData => {return this.coreService.customDate(rowData.invoiceDate)}
            {headerName: 'Voucher', field: 'voucherType'},
            //{headerName: 'Order No', field: 'orderNo' },
            //{headerName: 'Order Date', field: 'orderDate', cellTemplate: FullDateFormatCell },
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellTemplate: NumberCell},
            //{headerName: 'Discount', field: 'discountAmount', class: 'text-right', cellTemplate: NumberCell }
        ];
    }

    ngOnInit(){ super.ngOnInit(); }
}*!/

*/
