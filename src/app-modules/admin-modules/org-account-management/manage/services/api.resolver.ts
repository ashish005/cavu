import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve } from "@angular/router";
import {CoreAccountLookup, CoreAccountLookupSerializer} from "../domains/lookup.serializer";
import { ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {AccountGroupCreateEditComponent} from "../components/account-group-ce.component";
import {AccountCreateEditComponent} from "../components/account-ce.component";

@Injectable()
export class AccountingAPIResolver extends OrgResourceService<CoreAccountLookup> implements Resolve<any> {
  masterType: CoreAccountLookup;
  constructor(public override injector: Injector, private sharedService: SharedService) {
      super(injector, 'accountingLookup', new CoreAccountLookupSerializer());
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => { this.masterType = results['data']; };
    const failure = (err: any) => { };

    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(null, setup, success, failure);
  }

  /*fetchAccountByName = (name: string) => {
        return this.httpClient
            .get(`${this.viewUrl}/ledger-by-name/${name}`, this.requestHeaders)
            .pipe(
                tap((resp: any) => console.log('read logged')),
                catchError(error => super.handleError(error, () => this.fetchAccountByName(name)))
            );
    }

    fetchCashAccountByName = (name: string) => {
        return this.httpClient
            .get(`${this.viewUrl}/ledger-by-cash/${name}`, this.requestHeaders)
            .pipe(
                tap((resp: any) => console.log('read logged')),
                catchError(error => super.handleError(error, () => this.fetchCashAccountByName(name)))
            );
    }

    fetchBankAccountByName = (name: string) => {
        return this.httpClient
            .get(`${this.viewUrl}/ledger-by-bank/${name}`, this.requestHeaders)
            .pipe(
                tap((resp: any) => console.log('read logged')),
                catchError(error => super.handleError(error, () => this.fetchBankAccountByName(name)))
            );
    }*/
    // showVoucherDetails(voucherId: number, voucherTypeId: number){
    //     const url = `${this.baseSectorAPIUrl}finance/voucher-detail/${voucherId}/${voucherTypeId}`;
    //
    //     return this.httpClient.get(url, this.requestHeaders)
    //         .pipe(
    //             tap(
    //                 (resp: any) => console.log('read logged')
    //             ),
    //             catchError((error)=>{ return throwError(error); })
    //         );
    // }
    // deleteVoucher(voucherId: string, voucherTypeId: string){ return this.lookupMasterService.deleteVoucher(voucherId, voucherTypeId); }
  // showVoucherPopup(data, popupHeader){
  //   const  {voucherMasterType, voucherType, voucherNo, voucherId, voucherTypeId, actionType } = data;
  //
  //       const inputData: any = {
  //           id: voucherId,
  //           data: {
  //               voucherMasterType: voucherMasterType,
  //               voucherType: voucherType,
  //               voucherId: voucherId,
  //               voucherTypeId: voucherTypeId,
  //               projectId: null,
  //               customerId: null
  //           },
  //           actionType: actionType
  //       };
  //       this.openVoucherPopup(inputData, popupHeader);
  //   }
  // openVoucherPopup(inputData, popupHeader){
  //       const onSuccess = (resp)=> {
  //           this.pluginFactory.destroy();
  //       };
  //       const onFailure = (resp)=> {
  //           this.pluginFactory.destroy();
  //       };
  //       this.pluginFactory.showVoucherReportPopup(inputData, popupHeader).then(onSuccess, onFailure);
  //   }
  // generateFile(){ this.lookupMasterService.getFile(); }
    /*showLedgerWiseGridReportPopup(inputData: any, popupHeaderOption: any){
        /!*const popup = {
            header: popupHeaderOption,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75,
            actionType: ACTION_ENUM.SHOW
        };
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showLedgerWiseGridReportPopup(inputData, popupHeaderOption).then(success, failure);*!/
    }

    showAccountGroupLedgerView(inputData: any, popupHeaderOption: any){
        /!*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const error = (resp: any) => { this.pluginFactory.destroy(); };
        //let modal$ = this.popupService.showCustomPopup(FinanceTrialBalancePopupView, popup, inputData);
        this.pluginFactory.showAccountGroupLedgerView(inputData, popupHeaderOption).then(success, error);*!/
    }*/

    accountGroupPopup(inputData: any, popupHeaderOption: any, cb){
        const popup = {
            header: popupHeaderOption,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp)=> {
            this.sharedService.destroy();
            cb();
        };
        const error = (resp)=> {
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(AccountGroupCreateEditComponent, popup, inputData);
        modal$.then(success, error);
    }
    accountPopup(inputData: any, popupHeaderOption: any, cb){
        const popup = {
            header: popupHeaderOption,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const error = (resp)=> {
            this.sharedService.destroy();
        };

        const success = (resp)=> {
            this.sharedService.destroy();
            cb();
        };

        let modal$ = this.sharedService.showCustomPopup(AccountCreateEditComponent, popup, inputData);
        modal$.then(success, error);
    }
}
