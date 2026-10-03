import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {Branch, Business, SoftwareLicense} from "../domains/business.serializer";
import {ModulePermission, ModulePermissionQueryOptions} from "../domains/module-permission.serializer";
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModulePermissionService} from "../services/module-permission.service";
import {BusinessAPIResolver} from "../services/api.resolver";
import {Software, SoftwarePlanLookup} from "../domains/lookup.serializer";

@Component({
  templateUrl: './templates/org-module-permission.html',
  standalone: false
})
export class OrgModulePermissionComponent implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() data: Business;
  //@Input() license: SoftwareLicense;
  customForm: FormGroup;
  submitted: boolean = false;

  software: Software;
  plan: SoftwarePlanLookup;
  @Output() onOk: EventEmitter<any>= new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any>= new EventEmitter<any>();
  constructor(public fb: FormBuilder, private permissionService: ModulePermissionService, private apiResolver: BusinessAPIResolver){
    this.customForm = this.fb.group({
      modules: this.fb.array([])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  initItemRows(data) {
    const module = this.fb.group({
      id: [ (data)?data.id: null],
      name: [ (data)?data.name:'', Validators.required],
      code: [ (data)?data.code:'', Validators.required],
      description: [ (data)?data.description: null],
      isActive: [data?.isActive],
      parentId: [ (data)?data.parentId: null],
      children: this.fb.array([])
    });

    (data.children || []).map(k =>{
      (<FormArray>module.get('children')).push(this.initItemRows(k));
    });

    return module
  }

  // Create a getter for the 'children' FormArray with explicit type casting
  // get children(index): FormArray {
  //   return this.moduleForm.at(index).get('children') as FormArray;
  // }

  get moduleForm(): FormArray {
    return this.customForm.get('modules') as FormArray;
  }

  getChildrenArray(parentGroup: AbstractControl): FormArray {
    return parentGroup.get('children') as FormArray;
  }

  populateData(data: Array<ModulePermission>){
    this.moduleForm.controls.length = 0;
    (data || []).map((r)=> this.addNewRow(r));
  }

  addNewRow(data) {
    this.moduleForm.push(this.initItemRows(data));
  }

  ngOnInit(){
    this.getModulesByLicense();
  }

  getModulesByLicenseChange(plan: SoftwarePlanLookup){
    this.plan = plan;
    this.getModulesByLicense();
  }

    getModulesByLicense()
    {
      const { orgSectorMasterType, orgUnitId, license: { softwareCode, softwareId, licenseTypeId } } = this.data;

      this.software = this.apiResolver.masterType.getSoftwareById(softwareId);
      if(!this.plan){
        this.plan = this.apiResolver.masterType.getLicenseTypesBySoftwareId(softwareId, licenseTypeId);
      }
      const { masterType } = this.plan || { masterType: null };

      const query = new ModulePermissionQueryOptions();
      query.orgUnitId = orgUnitId;
      query.orgSector = orgSectorMasterType;
      query.softwareCode = softwareCode;
      query.licenseType = masterType;

      if(masterType) {
        const modulesData = this.permissionService.list(query).toPromise();
        modulesData.then((r: any)=> {
          this.populateData(r.entities || []);
        }, ()=>{});
      }
    }

  updateModules(){
    const form = this.customForm.getRawValue();
    this.submitted = true;
    (form.modules || []).forEach(module => {
      module.status = module.isActive ? 1 : 2;
      (module.children || []).forEach(child => {
        child.status = child.isActive ? 1 : 2;
      });
    });
    const { orgUnitId } = this.data;
    const modulesData = this.permissionService.updatePermission(orgUnitId, form.modules).toPromise();
    modulesData.then((r: any)=> {
      this.submitted = false;
    }, ()=>{
      this.submitted = false;
    });
  }

    updateModulesByLicenseType()
    {
        const { masterType, id } = this.plan;
        const { orgSectorMasterType, orgUnitId } = this.data;

        this.submitted = true;
        const modulesData = this.permissionService.updateBusinessPermissionModulesByLicenseType(orgUnitId, orgSectorMasterType, { id: id,  licenseType: masterType}).toPromise();
        modulesData.then((r: any)=> {
            this.submitted = false;
        }, ()=>{
            this.submitted = false;
        });
    }
}
