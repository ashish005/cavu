import {Component, OnInit} from "@angular/core";
import {SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {BankingAPIResolver} from "../services/api.resolver";
import {BankTrxnService} from "../services/bank-trxn.service";
import {BankTrxn, BankTrxnQueryOptions} from "../domains/bank-trxn.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/bank-trxn.html',
    styles: [`:host { display: contents; }`],
})
export class BankTrxnView extends ViewExtender<BankTrxn> implements OnInit {
  override coreState: BankTrxnQueryOptions = new BankTrxnQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: BankTrxnService,
              public apiResolver: BankingAPIResolver,
              protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'RefNo', field: 'refNo' },
            {headerName: 'Payeee', field: 'payeee' },
            {headerName: 'Date', field: 'date' },
            {headerName: 'TrxnType', field: 'trxnType' },
            {headerName: 'Deposits', field: 'deposits' },
            {headerName: 'Withdrawls', field: 'withdrawls' }
        ];
    }

    ngOnInit() {
      const { key } = this.activatedRoute.snapshot.data;
        this.coreState.status = key;
        super.populateGrid();
    }
    actionCb(e){}
}
