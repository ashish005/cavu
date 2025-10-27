import {CoreQueryOptions, CoreResource} from "@app-global";

export class VendorExecutiveQueryOptions extends CoreQueryOptions{
  accountId: string;
  branchId: string;
  vendorId: string;
  constructor(model: any = {}){
      super(model);
  }

  override toQueryString (){
      const obj = {
          accountId: this.accountId,
          branchId: this.branchId,
          vendorId:this.vendorId
      };
      return super.getParamByObject(obj);
  }
}

export class VendorExecutive extends CoreResource {
    accountId: string;
    fName: string;
    lName: string;
    email: string;
    phoneNo: string;
    branchId: number;
    userId: number;
    hasLoginAccount: boolean;
    constructor(model: any = <any>{}) {
        const { id, accountId, fName, lName, email, phoneNo, branchId, userId, hasLoginAccount } = model;
        super();
        this.id = id;
        this.accountId = accountId;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.branchId = branchId;
        this.userId = userId;
        this.hasLoginAccount = hasLoginAccount;
    }
}

export class VendorExecutiveSerializer {
  fromJson(json: any): VendorExecutive {
    return new VendorExecutive(json);
  }
  toJson(model: any): any {
    return model;
  }
}
