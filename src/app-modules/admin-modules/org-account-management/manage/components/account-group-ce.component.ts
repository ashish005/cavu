import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild, Directive, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {AccountGroupForm} from "../forms/account-group.form";
import {AccountingAPIResolver} from "../services";
import {AccountGroupService} from "../services/ledger.service";

@Component({
  standalone: false,
  selector: 'account-group-create-edit',
  templateUrl: './templates/account-group-ce.html',
  styles: [':host { display: contents; }']
})
export class AccountGroupCreateEditComponent extends AccountGroupForm implements OnInit {
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Input() id: any;
  @Input() set data(item: any) { this.populateAccountGroup(item || {}); };

  submitted: boolean;
  groupsByNature: Array<any>;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  constructor(public override fb: FormBuilder, private service: AccountGroupService, public apiResolver: AccountingAPIResolver) {
    super(fb);
      const natureValueChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next)
          {
              this.groupsByNature = this.apiResolver.masterType.groupsByNature(next);
          } else if(!next){
              this.groupsByNature = this.apiResolver.masterType.groups;
          }
      };
      this.formAccountNature.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(natureValueChange);
  }

  ngOnInit(): void {
    // this.feeTaxTypeService.getAll().subscribe((resp)=>{
    //   this.taxTypeData = new FeeTaxTypeArray(resp.entities);
    // });
   }
  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) { return; }
    this.submitted = true;

    const failure = ()=>{
        this.submitted = false;
    };

      const addSuccess = (resp: any) => {
          const item = resp.data;

          const loop = (groups)=> {
              const findIndex = (group, index)=> {
                  if (group.id != item.parentGroupId) {
                      if (group.children?.length) {
                          loop(group.children || []);
                      }
                  } else {
                      group.children.push(item);
                  }
              };
              (groups || []).forEach(findIndex);
          };
          loop(this.groupsByNature);
          this.submitted = false;
          this.onOk.emit(true);
      };

      const updateSuccess = (resp: any) => {
          const item = resp.data;

          const loop = (groups)=> {
              const findIndex = (group, index)=> {
                  if (group.id != item.id) {
                      if (group.children?.length) {
                          loop(group.children || []);
                      }
                  } else {
                      group.name = item.name;
                  }
              };
              (groups || []).forEach(findIndex);
          };
          this.submitted = false;
          this.onOk.emit(true);
      };
    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, form.value).subscribe(updateSuccess, failure);
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(form.value).subscribe(addSuccess, failure);
    }
  }
}
