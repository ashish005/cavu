import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NumberCell, ViewExtender, SharedService} from "@app-global";
import {Expense, ExpenseQueryOptions} from "../domains/expense.serializer";
import {ExpenseAPIResolver} from "../services/api.resolver";
import {ExpenseVoucherService} from "../services/expense.service";
import {
    ExpenseActionCell,
    ExpenseAmountCell, ExpenseVoucherDateCell,
    ExpenseVoucherNameCell
} from "../components/grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ExpenseManageView extends ViewExtender<Expense> implements OnInit, OnDestroy {
  override coreState: ExpenseQueryOptions = new ExpenseQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ExpenseVoucherService,
              public apiResolver: ExpenseAPIResolver,
              public sharedService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Party', field: 'party.name', cellFn: rowData => `${rowData?.voucher?.name}`},
          {headerName: 'Invoice No', field: 'voucherNo', cellTemplate: ExpenseVoucherNameCell},
          {headerName: 'Invoice Date', field: 'voucherDate', cellTemplate: ExpenseVoucherDateCell},
          {headerName: 'Amount', field: 'netAmount', class: 'text-right', cellTemplate: NumberCell },
          {headerName: '', field: '', class: 'text-right', cellTemplate: ExpenseActionCell},
          //{headerName: 'Discount', field: 'discountAmount', class: 'text-right', cellTemplate: NumberCell }
      ];

      /*super.subjectSubscription = this.apiResolver.getSubject().subscribe(r => {
          if(r)
          {
              super.populateGrid();
          }
      });*/
  }

  ngOnInit(){
      super.populateGrid();
  }

  override ngOnDestroy()
  {
      super.ngOnDestroy();
  }

  actionCb(row: Expense)
  {
      const { voucherNo, isItemInvoice, voucherId, voucherTypeId, voucherType, voucherMasterType, projectId } = row.voucher;
      /*const inputData: any = {
          data: {
              id: voucherId,
              voucherMasterType: 'PURCHASE'
          }
      };
      this.voucherFactory.showVoucherPopup(inputData, {text: `Expense Invoice`, desc: '' }, ()=>{});*/
  }

  showDetails(project){}
}
