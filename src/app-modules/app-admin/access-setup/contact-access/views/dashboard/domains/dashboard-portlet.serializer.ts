import { CoreQueryOptions, STATUS_ENUM } from "@app-global";

export class DashboardPortletQueryOptions extends CoreQueryOptions{
    userMasterType: string;
    override toQueryString (){
        const obj = {
            userMasterType:this.userMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class PortletPermission {
  id: string;
  portletId: number;
  isVisible: boolean;
  userRoleId: string;
  userTypeId: number;
  status: boolean;
  statusText: string;
  userRoleName: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.portletId = model.portletId;
    this.isVisible = model.isVisible || false;
    this.userRoleId = model.userRoleId;
    this.userTypeId = model.userTypeId;
    this.status = model.status;
    this.statusText = model.statusText;
    this.userRoleName = model.userRoleName;
  }
}

export class DashboardPortlet {
  id: string;
  name: string;
  code: string;
  description: string;
  footer: string;
  sortOrder: number;
  isVisible: boolean;
  isClassView: boolean;
  isCourseView: boolean;
  userTypeId: number;
  status: boolean;
  permissions: Array<PortletPermission>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
    this.description = model.description;
    this.footer = model.footer;
    this.sortOrder = model.sortOrder;
    this.isVisible = model.isVisible;
    this.isClassView = model.isClassView;
    this.isCourseView = model.isCourseView;
    this.userTypeId = model.userTypeId;
    this.status = model.status;
    this.permissions = (model.permissions || []).map(r => new PortletPermission(r));
  }
}

export class DashboardPortletSerializer{
  fromJson(json: any): DashboardPortlet {
    return new DashboardPortlet(json);
  }

  toJson(data: any): any {
    (data.permissions || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
    return data;
  }
}
