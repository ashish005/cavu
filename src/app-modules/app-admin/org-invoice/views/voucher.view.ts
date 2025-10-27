import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FullDateFormatCell, NumberCell, ViewExtender} from "@app-global";
import {OrgInvoiceService} from "../services/invoice.service";
import {InvoiceQueryOptions, OrgInvoice} from "../domains/invoice.serializer";
import {LookupVoucherType} from "../domains/lookup.serializer";
import {OrgInvoiceAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/voucher.html',
  styles: [`:host { display: contents;}`]
})
export class VoucherView extends ViewExtender<OrgInvoice> implements OnInit, OnDestroy {
  override coreState: InvoiceQueryOptions = new InvoiceQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public apiResolver: OrgInvoiceAPIResolver,
              public override service: OrgInvoiceService)
    {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };

        this.gridOptions.columnDefs = [
            {headerName: 'Invoice No', field: 'voucherNo' },
            {headerName: 'Voucher', field: 'voucherTypeName' },
            {headerName: 'Date', field: 'voucherDate', cellTemplate: FullDateFormatCell },
            {headerName: 'Amount', field: 'netAmount', class: 'text-right', cellTemplate: NumberCell }
        ];
    }

    ngOnInit()
    {
        this.activatedRoute.params.subscribe((params: Params) => {
            const { voucherTypeId } = params;
            const vType = this.apiResolver.getVoucherTypeById(voucherTypeId);
            const { masterType } = vType;
            this.apiResolver.vType = vType;
            (<InvoiceQueryOptions>this.coreState).voucherTypeId = voucherTypeId;
            (<InvoiceQueryOptions>this.coreState).voucherMasterType = masterType;
            super.populateGrid();
        });
    }

    override ngOnDestroy(){
        super.ngOnDestroy();
    }

    actionCb(row: OrgInvoice){
        const { voucherNo, id, voucherTypeId, voucherTypeName, voucherMasterType, projectId } = row;
        const inputData: any = {
            id: id,
            data: {
                isItemInvoice: false,
                voucherMasterType: voucherMasterType,
                voucherTypeName: voucherTypeName,
                voucherId: id,
                voucherTypeId: voucherTypeId,
                projectId: projectId,
                customerId: null,
            }
        };
        this.apiResolver.voucherReportPopup(inputData, {text: `${voucherNo}`, desc: '' }, ()=>{
            super.populateGrid();
        });
    }

    newVoucher(voucherType: LookupVoucherType)
    {
        const { masterType, name, id } = voucherType;
        const data = {
            isItemInvoice: false,
            voucherMasterType: masterType,
            voucherType: name,
            voucherId: null,
            voucherTypeId: id,
            projectId: null,
            customerId: null
        };
        const inputData = { data};
        this.apiResolver.voucherReportPopup(inputData, { text: `${voucherType.name}`, desc: '' }, ()=>{
            super.populateGrid();
        });
    }
}
