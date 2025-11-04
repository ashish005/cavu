import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RolePermissionService} from "../../services/role-permission.service";
import {RoleForm} from "../../forms/role.form";
import {UserManagementAPIResolver} from "../../services/api.resolver";
import {Subscription} from "rxjs";

@Component({
    standalone: false,
  templateUrl: './user-role-ce.html',
})
export class UserRoleCeComponent extends RoleForm implements OnInit, OnDestroy {
  actionType: string = 'Create';
  submitted: boolean = false;

  @Input() id: any;
  @Input() set data(info) { this.customForm.patchValue(info); };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  private subscriber: Subscription;
  constructor(public override fb: FormBuilder, private service: RolePermissionService, public apiResolver: UserManagementAPIResolver) { super(fb); }

  ngOnInit(){}
  ngOnDestroy(){
    this.subscriber?.unsubscribe();
  }

  onSubmit(){
    if(this.customForm.invalid){
      return;
    }
    const successCreation =(r)=>{
      this.submitted = false;
      this.apiResolver.masterType.userRoles.push(r.data);
      this.onOk.emit(true);
    };
    const successUpdate =(k: any)=>{
        this.apiResolver.masterType.userRoles.forEach(r=> {
            if(r.id == k.id){
                r.name = k.name;
            }
        });
        this.submitted = false;
        this.onOk.emit(true);
    };
    const error =()=>{
      this.submitted = false;
    };
    const data = this.customForm.getRawValue();

    if(this.customForm.valid){
      this.submitted = true;
      if(!data.id){
        this.subscriber = this.service.createRole(data).subscribe(successCreation, error);
      } else {
        this.subscriber = this.service.updateRole(data).subscribe( successUpdate, error);
      }
    }
  }
}
