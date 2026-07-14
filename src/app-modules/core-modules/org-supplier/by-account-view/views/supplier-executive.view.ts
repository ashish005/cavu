import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender} from "@app-global";
import {Component, Input, OnInit} from "@angular/core";
import {VendorExecutive, VendorExecutiveQueryOptions} from "../domains/vendor-executive.serializer";
import {ActivatedRoute} from "@angular/router";
import {VendorByIdAPIResolver} from "../services/api.resolver";
import {VendorExecutiveCEComponent} from "../components/vendor-executive-ce.component";
import {SupplierExecutiveService} from "../services/supplier-executive.service";

@Component({
    styles: [`:host { display: contents;}`],
    templateUrl: './templates/default-view.html',
  standalone: false
})
export class SupplierExecutiveView extends ViewExtender<VendorExecutive> implements OnInit {
    lookups: any;
    header: any = { text: 'Executive', options:[] };
    override coreState: VendorExecutiveQueryOptions = new VendorExecutiveQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: SupplierExecutiveService,
                protected sharedService: SharedService, public apiResolver: VendorByIdAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'First Name', field: 'fName' },
            {headerName: 'Last Name', field: 'lName' },
            {headerName: 'Email', field: 'email' },
            {headerName: 'PhoneNo', field: 'phoneNo' },
            {headerName: 'Can Login', field: 'hasLoginAccount' }
        ];
    }

    branchId: any;
    vendorId: string;
    accountId: string;

    ngOnInit(){
        const { data, parent } = this.activatedRoute.snapshot;
        //const { productId, vendorId} = parent.params;
        const { id, accountId, vendorId } = parent.data['item']?.data;
        this.branchId = id;
        this.vendorId = vendorId;
        this.accountId = accountId;
        (<any>this.coreState).vendorId = vendorId;//this.apiResolver.vendor.id;
        (<any>this.coreState).accountId = accountId;//this.apiResolver.vendor.id;
        (<any>this.coreState).branchId = id;
        super.populateGrid();
    }

    createNew()
    {
        const data = new VendorExecutive();
        data.branchId = this.branchId;
        data.accountId = this.accountId;
        const inputData: any = {
            id: null,
            branchId: this.branchId,
            accountId: this.accountId,
            data: data
        };
        this.showPopup(inputData,{ text: `Manage Executive`, desc: 'Manage Executive screen' });
    }

    actionCb(row: VendorExecutive)
    {
        const { id } = row;
        const inputData: any = {
            id: id,
            vendorId: this.vendorId,
            accountId: this.accountId,
            data: row
        };
        this.showPopup(inputData, { text: `Executive`, desc: 'Manage Executives' });
    }

    showPopup(inputData, header)
    {

        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50
        };
        const success = (resp: any)=>{
            super.populateGrid();
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VendorExecutiveCEComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
