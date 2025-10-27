// import {CoreQueryOptions, CoreResource} from "@app-global";
// import {Vendor} from "./vendor.serializer";
// import {NotificationUser} from "@app-base/models/notification/recipient.serializer";
//
// export class VendorBranchQueryOptions extends CoreQueryOptions{
//     accountId: string;
//     vendorId: string;
//     constructor(model: any = {}){
//         super(model);
//     }
//
//     toQueryString (){
//         const obj = {
//             accountId: this.accountId,
//             vendorId: this.vendorId
//         };
//         return super.getParamByObject(obj);
//     }
// }
//
// export class VendorBranch extends CoreResource {
//     name: string;
//     code: string;
//     contactNo: string;
//     contactEmail: string;
//     address: [''];
//     city: [''];
//     pinCode: [''];
//
//     accountId: string;
//     vendorId: string;
//
//     fName: string;
//     lName: string;
//     email: string;
//     phoneNo: string;
//     vendor: Vendor;
//     executiveCount: number;
//     dateWiseBalance: number;
//     registrationDate: string;
//
//     userAudit: UserAuditInfo;
//     notificationUser: NotificationUser;
//     constructor(model: any = <any>{}) {
//         const {
//             id, name, code, contactNo, contactEmail, address, city, pinCode,
//             fName, lName, email, phoneNo, executiveCount, vendor,
//             dateWiseBalance, accountId, vendorId,
//             notificationUser, userAuditInfo
//         } = model;
//         super();
//         this.id = id;
//         this.name = name;
//         this.code = code;
//         this.contactNo = contactNo;
//         this.contactEmail = contactEmail;
//         this.address = address;
//         this.city = city;
//         this.pinCode = pinCode;
//         this.accountId = accountId;
//         this.vendorId = vendorId;
//         this.dateWiseBalance = dateWiseBalance;
//
//         this.fName = fName;
//         this.lName = lName;
//         this.email = email;
//         this.executiveCount = executiveCount;
//         this.vendor = new Vendor(vendor);
//         this.registrationDate = this.vendor.registrationDate;
//
//         this.userAudit = new UserAuditInfo(userAuditInfo);
//         this.notificationUser = new NotificationUser(notificationUser);
//     }
// }
//
// export class VendorBranchSerializer {
//     fromJson(json: any): VendorBranch {
//         return new VendorBranch(json);
//     }
//     toJson(model: any): any {
//         return model;
//     }
// }
