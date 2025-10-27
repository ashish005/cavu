export type ModulePermissionValues =
    'users.view' | 'users.manage' |
    'roles.view' | 'roles.manage' | 'roles.assign';

export class ModulePermission {
  constructor(model: any = {}) {
    const { id, parentId, name, code, view, create, destroy, modify } = model;
    this.id = id;
    this.parentId = parentId;
    this.name = name;
    this.code = code;

    this.view = view;
    this.create = create;
    this.destroy = destroy;
    this.modify = modify;
  }

  public id: number;
  public parentId: number;

  public name: string;
  public code: string;

  public view: boolean;
  public create: boolean;
  public destroy: boolean;
  public modify: boolean;
}

export interface PermissionAction {
  (eProperty: any, parameters: any): void;
}

export class PermissionRegistry {
  actions: {[key: string]: PermissionAction} = {};

  clear() {
    this.actions = {};
  }

  register(moduleKey: string, action: PermissionAction) {
    this.actions[moduleKey] = action;
  }

  get(actionId: string) {
    return this.actions[actionId];
  }
}
