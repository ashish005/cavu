import {CoreQueryOptions, CoreResource} from "@app-global";

export class ExecutiveQueryOptions extends CoreQueryOptions{
  orgUserId: string;
  constructor(model: any = {}){
      super(model);
  }

  override toQueryString (){
      const obj = {
          orgUserId: this.orgUserId
      };
      return super.getParamByObject(obj);
  }
}

export class Executive extends CoreResource {
    accountId: string;
    fName: string;
    lName: string;
    email: string;
    phoneNo: string;
    branchId: number;
    userId: number;
    constructor(model: any = <any>{}) {
        const { id, accountId, fName, lName, email, phoneNo, branchId, userId } = model;
        super();
        this.id = id;
        this.accountId = accountId;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.branchId = branchId;
        this.userId = userId;
    }
}

export class ExecutiveSerializer {
  fromJson(json: any): Executive {
    return new Executive(json);
  }
  toJson(model: any): any {
    return model;
  }
}
