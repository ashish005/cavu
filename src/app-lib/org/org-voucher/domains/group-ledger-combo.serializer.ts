// import {CoreQueryOptions, CoreResource, DateHelper} from "@app-core";
//
// export class GroupLedgerComboQueryOptions extends CoreQueryOptions{
//   fromDate: Date;
//   toDate: Date;
//   isLedgerWise: boolean;
//   accountGroupId: number;
//
//   constructor(model: any = {}){
//     super(model);
//   }
//
//   toQueryString (){
//     const obj = {
//       fromDate:this.fromDate,
//       toDate:this.toDate,
//       isLedgerWise:this.isLedgerWise,
//       accountGroupId:this.accountGroupId
//     };
//     if(!this.fromDate){
//         delete obj.fromDate;
//     }
//     if(!this.toDate){
//         delete obj.toDate;
//     }
//     const params = super.getParamByObject(obj);
//     return params;
//   }
// }
// export class GroupLedgerCombo extends CoreResource{
//     name: string;
//     accountCount: number;
//     accountId: string;
//     accountGroup: string;
//     accountGroupId: number;
//     accountNature: string;
//     amount: number;
//     credit: number;
//     debit: number;
//
//     isAsset: boolean;
//     isExpense: boolean;
//     isHighPriority: boolean;
//     isIncome: boolean;
//     isLedgerWise: boolean;
//     isLiability: boolean;
//     openingBalance: number;
//     closingBalance: number;
//     sortOrder: number;
//     children: Array<GroupLedgerCombo>;
//
//   constructor(model: any = <any>{}){
//     super();
//     const { id, name, accountCount, accountNature, accountId,
//         amount, credit, debit, accountGroup, accountGroupId,
//         openingBalance, closingBalance,
//         isAsset, isHighPriority, isExpense, isIncome, isLedgerWise, isLiability, children
//     } = model;
//     this.id = id;
//     this.name = name;
//     this.accountId = accountId;
//     this.accountGroup = accountGroup;
//     this.accountCount = accountCount;
//     this.accountNature = accountNature;
//     this.accountGroupId = accountGroupId;
//     this.amount = amount;
//     this.credit = credit;
//     this.debit = debit;
//
//     this.openingBalance = openingBalance;
//     this.closingBalance = closingBalance;
//
//     this.isAsset = isAsset;
//     this.isHighPriority = isHighPriority;
//     this.isIncome = isIncome;
//     this.isExpense = isExpense;
//     this.isLedgerWise = isLedgerWise;
//     this.isLiability = isLiability;
//     this.children = (children || []).map(r => new GroupLedgerCombo(r));
//   }
//
//   isGroupLedgerWise(){ return (this.accountCount>0 && !this.children.length); }
// }
// export class GroupLedgerComboSerializer{
//   fromJson(json: GroupLedgerCombo): GroupLedgerCombo { return new GroupLedgerCombo(json); }
//   toJson(model: any): any { return {}; }
// }
