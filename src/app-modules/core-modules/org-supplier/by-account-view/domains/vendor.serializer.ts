// import {CoreQueryOptions, CoreResource} from "@app-global";
// import {NotificationUser} from "@app-base/models/notification/recipient.serializer";
//
// export class VendorQueryOptions extends CoreQueryOptions{
//   searchAction: string;
//   constructor(model: any = {}){
//       super(model);
//       this.searchAction = model.searchAction || '';
//   }
//
//   toQueryString (){
//       const obj = {
//           searchAction:this.searchAction
//       };
//       return super.getParamByObject(obj);
//   }
// }
//
// export class Vendor extends CoreResource {
//     tradeName: string;
//     taxNo: string;
//
//     registrationNo: string;
//     registrationDate: string;
//     isRegistered: boolean;
//
//     supplyTypeId: number;
//     natureId: number;
//     purchaseTypeId: number;
//     amountCalcTypeId: number;
//     costCalcTypeId: number;
//
//     hasTaxByItem: number;
//     hasItemInclTax: number;
//     hasItemInclDiscount: number;
//     dateWiseBalance: number;
//
//     userId: string;
//
//     supplyType: string;
//     nature: string;
//     purchaseType: string;
//     productCount: number;
//     notificationUser: NotificationUser;
//     constructor(model: any = <any>{}) {
//         const {
//             id,
//             tradeName, taxNo,
//             isRegistered, registrationNo, registrationDate,
//             supplyTypeId, natureId, purchaseTypeId, amountCalcTypeId, costCalcTypeId,
//             hasTaxByItem, hasItemInclTax, hasItemInclDiscount,
//             userId, supplyType, nature, purchaseType, productCount,
//             notificationUser
//         } = model;
//         super();
//         this.id = id;
//
//         this.tradeName = tradeName;
//         this.taxNo = taxNo;
//
//         this.isRegistered = isRegistered;
//         this.registrationNo = registrationNo;
//         this.registrationDate = registrationDate;
//
//         this.supplyTypeId = supplyTypeId;
//         this.natureId = natureId;
//         this.purchaseTypeId = purchaseTypeId;
//         this.amountCalcTypeId = amountCalcTypeId;
//         this.costCalcTypeId = costCalcTypeId;
//
//         this.hasTaxByItem = hasTaxByItem;
//         this.hasItemInclTax = hasItemInclTax;
//         this.hasItemInclDiscount = hasItemInclDiscount;
//
//         this.userId = userId;
//         this.supplyType = supplyType;
//         this.nature = nature;
//         this.purchaseType = purchaseType;
//         this.productCount =  productCount;
//
//         this.notificationUser = new NotificationUser(notificationUser);
//     }
// }
//
// export class VendorSerializer {
//   fromJson(json: any): Vendor {
//     return new Vendor(json);
//   }
//   toJson(model: any): any {
//     return model;
//   }
// }
