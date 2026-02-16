import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModulePermission} from "../domains/module-permission.serializer";
import {ModulePermissionService} from "../services/module-permission.service";
import {Software, SoftwareLicenseType} from "../domains/lookup.serializer";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'module-permission',
  templateUrl: './templates/module-permission.html',
  styles: [`:host {display: contents;}`],
    providers: [ModulePermissionService]
})
export class ModulePermissionView implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  customForm: FormGroup;
  submitted: boolean = false;

  software: Software;
  licenseType: SoftwareLicenseType;

  constructor(public fb: FormBuilder,
              public router: Router, public activatedRoute: ActivatedRoute,
              private service: ModulePermissionService){
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
      status: [(data && data.status == 'Active')],
      parentId: [ (data)?data.parentId: null],
      children: this.fb.array([])
    });

    (data.children || []).map(k =>{
      (<FormArray>module.get('children')).push(this.initItemRows(k));
    });

    return module
  }

  get moduleForm() { return <FormArray>this.customForm.get('modules'); }

  populateData(data: Array<ModulePermission>){
    this.moduleForm.controls.length = 0;
    (data || []).map((r)=> this.addNewRow(r));
  }

  addNewRow(data) {
    this.moduleForm.push(this.initItemRows(data));
  }

  ngOnInit(){ this.fetchModulesByLicense(null); }

    fetchModulesByLicense(licenseMasterType: string)
    {
        const success =(r: any)=> {
            if(r.data.software)
            {
                this.software = new Software(r.data.software);
            }

            /*if(this.software?.licenseTypes?.length && !licenseMasterType) {
                const { licenseMasterType } = this.data?.license || {};
                this.licenseType = this.software?.licenseTypes?.find(r => r.masterType == licenseMasterType);
            }*/
            this.populateData(r.entities || []);
        };
        const failure =(r: any)=> { };
        this.service.getModulesByLicense(licenseMasterType).then(success, failure);
    }

    getModulesByLicense(licenseType: SoftwareLicenseType)
    {
        this.licenseType = licenseType;
        this.fetchModulesByLicense(this.licenseType?.masterType);
    }

  updateModules(){
    const form = this.customForm.getRawValue();

    var items = (form.modules || []).reduce((result, r) => {
      r.status = (r.status) ? 'Active': 'InActive';
      (r.children|| []).map(k => k.status = (k.status) ? 'Active': 'InActive');

      result = result.concat(...r.children);
      delete r.children;
      result.push(r);
      return result;
    }, []);

      const success =(r: any)=> {
          this.submitted = false;
      };
      const failure =(r: any)=> {
          this.submitted = false;
      };

      this.submitted = true;

    this.service.updateBusinessPermissionModules(items).then(success, failure);
  }

    updateModulesByLicenseType()
    {
        const { masterType, id } = this.licenseType;

        const success =(r: any)=> {
            this.submitted = false;
        };
        const failure =(r: any)=> {
            this.submitted = false;
        };

        this.submitted = true;
        this.service.updatePermissionModulesByLicenseType(masterType, id).then(success, failure);
    }
}
