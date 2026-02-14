import {CoreQueryOptions} from "@app-global";

export class AccountGroupQueryOptions extends CoreQueryOptions{
  accountId: string;
  startDate: string;
  endDate: string;

  constructor(){ super(); }

  override toQueryString (){
    const obj = {
        accountId: this.accountId,
        fromDate: this.startDate,
        toDate: this.endDate
    };
    const params = super.getParamByObject(obj);
    return params;
  }
}

export class AccountGroup {
  id: any;
  name: string;
  isHighPriority: boolean;
  isNominalGroup: boolean;
  parentGroupId: number;
  accountNatureId: number;
  sortOrder: number;

    accountNatureName: string;
    accountCount: number;
    groupAccountCount: number;

    isLocked: boolean;
    status: string;

    children: Array<AccountGroup>;

  constructor(model: any = <any>{}){
      const {
          id, name, parentGroupId, accountNatureId, accountNatureName,
          isNominalGroup, isHighPriority, sortOrder,
          isLocked, status,
          accountCount, groupAccountCount, children
      } = model;
      this.id = id;
      this.name = name;
      this.parentGroupId = parentGroupId;
      this.accountNatureId = accountNatureId;
      this.accountNatureName = accountNatureName;

      this.isNominalGroup = isNominalGroup;
      this.isHighPriority = isHighPriority;

      this.isLocked = isLocked;
      this.status = status;
      this.sortOrder =  sortOrder;

      this.accountCount = accountCount;
      this.groupAccountCount = groupAccountCount;
      this.children = (children || []).map((r)=> new AccountGroup(r));
  }
}

export class AccountGroupSerializer{
  fromJson(json: any): AccountGroup { return new AccountGroup(json); }
  toJson(data: any): any { return data; }
}
