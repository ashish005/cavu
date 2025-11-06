import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {forkJoin} from "rxjs";
import {ModuleRightsForm} from "../../forms/module-rights.form";
import {RolePermissionService, UserPermissionService} from "../../services/role-permission.service";
import {UserManagementAPIResolver} from "../../services/api.resolver";
import {User} from "../../domains/user.model";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {UserRoleCeComponent} from "../user-role-ce/user-role-ce.component";
import {UserManagementLookup} from "../../domains/user-management.lookup";

@Component({
  standalone: false,
  selector: 'role-permission-manager',
  templateUrl: './templates/role-permission-manager.html',
  styles: [':host { display: contents; }']
})
export class RolePermissionManager extends ModuleRightsForm implements OnInit {
  @Input() showPermissionUpdateButton: boolean = false;
  @Input() showNew: boolean = true;
  @Input() singleRole: boolean = false;
  @Input() module: string;

  @Input() data: User;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  isLoading: boolean;
  lookup: UserManagementLookup;
  constructor(public override fb: FormBuilder,
              private apiResolver: UserManagementAPIResolver,
              public service: RolePermissionService,
              public userRolePermSvc: UserPermissionService,
              private sharedService: SharedService) {
    super(fb);
    this.lookup = apiResolver.masterType;
  }

  ngOnInit(){
      const roles = this.lookup.userRoles;
      this.updateBaseModuleRights(this.lookup.modules);
      let userRoles;
      if(this.data && this.data.roles) {
          userRoles = (this.data.roles || []).reduce((result, curr) => {
            result[curr.id] = curr.id;
            return result;
          }, {});

          for(let role of roles){
              role.hasRole = !!(userRoles[role.id]);
          }
      }

      this.updateBaseRoles(roles);// first set roles
      if(this.data?.roles?.length){
        this.applyRole(); // apply role
      }
      this.checkForPermissionEnabled();
      //this.cb.emit({ key: ACTION_ENUM.checkRoles});
  }

  checkForPermissionEnabled(){
      if(!this.showPermissionUpdateButton) { super.formModuleRight.disable(); }
  }

  updateRoles(){
    // let dataIds = this.formRoles.controls.reduce((accu: Array<any>, curr) => {
    //   if(curr.get('hasRole'). value) {
    //     accu.push(curr.get('id').value);
    //   }
    //   return accu;
    // }, []);
    // if(this.singleRole){
    //   dataIds = [ this.activeUserType.id ];
    // }

    const modulesRight = (this.formModuleRight.getRawValue() || []).reduce((result: Array<any>, curr: any)=>{
       (curr.modulePermission || []).map(child => {
         result.push(child);
       });
      delete curr.modulePermission;
      result.push(curr);
      return result;
    }, []);

    // var allAPIs = dataIds.map(r => {
    //   return this.userRolePermSvc.updateModulePermissions(r, {moduleRight: modulesRight } );
    // });
    this.isLoading = true;
    this.userRolePermSvc
            .updateModulePermissions(this.activeUserType.id, {moduleRight: modulesRight } )
            .subscribe(r=> { this.isLoading = false; }, err=>{ this.isLoading = false; });
  }

  public applyRole(){
    const success = (resp)=> {
      this.isLoading = false;
      this.updateBaseModuleRights(resp.entities);
      this.checkForPermissionEnabled();
    };
    const error = ()=> {this.isLoading = false;};

    const dataIds = this.formRoles.controls.reduce((accu, curr) => {
      if(curr.get('hasRole'). value) {
        accu.push(curr.get('id'). value);
      }
      return accu;
    }, []);

    if(dataIds.length>0) {
      this.isLoading = true;
      this.userRolePermSvc.getModulesByRoleId(dataIds).subscribe(success, error);
    }
  }

  showDetails(row){
    this.activeUserType = row;
    const success = (resp)=> {
      this.isLoading = false;
      this.updateBaseModuleRights(resp.entities);
    };
    const error = ()=> {this.isLoading = false;};
    this.isLoading = true;
    this.userRolePermSvc.getModulesByRoleId([ row.id ]).subscribe(success, error);
  }

  clearFilter(e) { this.activeUserType = null; }
  submitRoleForm(data){}

  onCreateEditRoleSubmit(){
    if(!this.ceRoleForm.valid){ return; }
    const success =()=>{ this.isLoading = false; };
    const error =()=>{ this.isLoading = false; };

    const data = this.ceRoleForm.getRawValue();
    this.isLoading = true;
    if(!data.id){
      this.service.createRole(data).subscribe(success, error);
    } else {
      this.service.updateRole(data).subscribe(success, error);
    }
  }

    newRole() {
        const popup = {
            header: {text: `Create Role`, desc: 'Create Role'},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const inputData: any = {
            id: null,
            data: {}
        };
        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e) => { this.sharedService.destroy(); };
        let modal$ = this.sharedService.showCustomPopup(UserRoleCeComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
