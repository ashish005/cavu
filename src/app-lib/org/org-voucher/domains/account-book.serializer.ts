// import {CoreQueryOptions, CoreResource, DateHelper} from "@app-core";
//
// export class AccountBookQueryOptions extends CoreQueryOptions{
//     groupId: string;
//     accountId: string;
//     fromDate: string;
//     toDate: string;
//
//     constructor(model: any = {}){
//         super(model);
//     }
//
//     toQueryString (){
//         const obj = {
//             groupId:this.groupId,
//             accountId: this.accountId,
//             fromDate:this.fromDate,
//             toDate: this.toDate,
//         };
//         const params = super.getParamByObject(obj);
//         return params;
//     }
// }
//
// export class Account {
//   id: string;
//   name: string;
//   printName: string;
//   accountGroupId: number;
//   //businessId: number;
//   openingBalance: number;
//   openingBalanceDate: string;
//
//   creditDaysSale: number;
//   creditDaysPurchase: number;
//
//   billByBill: boolean;
//   creditLimit: number;
//   isLocked: boolean;
//   closingBalance: number;
//
//     currentYearBalance: number;
//     previousYearBalance: number;
//     currentQtrBalance: number;
//     previousQtrBalance: number;
//     balance: number;
//
//   constructor(model: any = <any>{}){
//       const { id, name, printName, accountGroupId, openingBalance, openingBalanceDate,
//           creditDaysSale, creditDaysPurchase, billByBill, creditLimit, isLocked, closingBalance,
//           currentYearBalance, previousYearBalance, currentQtrBalance, previousQtrBalance, balance } = model;
//     this.id = id;
//     this.name = name;
//     this.printName = printName;
//     this.accountGroupId = accountGroupId;
//     //this.businessId = model.businessId;
//     this.openingBalance = openingBalance;
//     this.openingBalanceDate =  openingBalanceDate;
//     this.creditDaysSale = creditDaysSale;
//     this.creditDaysPurchase = creditDaysPurchase;
//     this.billByBill = billByBill;
//     this.creditLimit = creditLimit;
//     this.isLocked = isLocked || false;
//     this.closingBalance = closingBalance;
//
//   this.currentYearBalance = currentYearBalance;
//   this.previousYearBalance = previousYearBalance;
//   this.currentQtrBalance = currentQtrBalance;
//   this.previousQtrBalance = previousQtrBalance;
//   this.balance = balance;
//   }
// }
//
// export class AccountBook extends CoreResource{
//     head: string;
//     extraInfo: string;
//     voucherDate: Date;
//     credit: string;
//     debit: string;
//     entryBy: string;
//     entryDate: Date;
//     description: string;
//     voucherTypeName: string;
//     voucherMasterType: string;
//     voucherNo: string;
//     voucherTypeId: number;
//     voucherId: number;
//     remark: string;
//
//     constructor(model: any = <any>{}){
//         super();
//         this.head = model.head;
//         this.extraInfo = model.extraInfo;
//         this.voucherDate = model.voucherDate;
//         this.credit = model.credit;
//         this.debit = model.debit;
//         this.entryBy = model.entryBy;
//         this.entryDate = model.entryDate;
//         this.description = model.description;
//         this.voucherTypeName = model.voucherTypeName;
//         this.voucherMasterType = model.voucherMasterType;
//         this.voucherNo = model.voucherNo;
//         this.voucherTypeId = model.voucherTypeId;
//         this.voucherId = model.voucherId;
//         this.remark = model.remark;
//     }
// }
//
// export class AccountBookSerializer{
//     fromJson(json: AccountBook): AccountBook {
//         return new AccountBook(json);
//     }
//
//     toJson(model: any): any {
//         return {
//             head: model.head,
//             extraInfo: model.extraInfo,
//             voucherDate: model.voucherDate,
//             credit: model.credit,
//             debit:  model.debit,
//             entryBy: model.entryBy,
//             entryDate: model.entryDate,
//             description:  model.description,
//             voucherType: model.voucherType,
//             voucherNo: model.voucherNo,
//             voucherTypeId: model.voucherTypeId,
//             voucherId: model.voucherId
//         };
//     }
// }
//
// export class AccountSerializer{
//   fromJson(json: Account): Account { return new Account(json); }
//
//   toJson(model: any): any {
//     return {
//       name: model.name,
//       printName: model.printName,
//       accountGroupId: model.accountGroupId,
//       businessId: model.businessId,
//       openingBalance: model.openingBalance,
//       openingBalanceDate: model.openingBalanceDate,
//       creditDaysSale: model.creditDaysSale,
//       creditDaysPurchase: model.creditDaysPurchase,
//       billByBill: model.billByBill,
//       creditLimit: model.creditLimit
//     };
//   }
// }
