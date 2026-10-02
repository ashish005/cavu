import { Component, Input, OnInit } from "@angular/core";
import {ModulePermission, ModulePermissionQueryOptions} from "../domains/module-permission.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {SoftwareModulesService} from "../services/software.service";
import {SoftwareSetupResolver} from "../services/api.resolver";
import {ViewExtender} from "@app-global";
import {SoftwareLookup} from "../domains/lookup.serializer";

@Component({
  selector: 'module-permission',
  templateUrl: './templates/module-permission.html',
  standalone: false
})
export class ModulePermissionComponent extends ViewExtender<ModulePermission> implements OnInit{
  software: SoftwareLookup;
  override coreState: ModulePermissionQueryOptions = new ModulePermissionQueryOptions();
  constructor(protected override activatedRoute: ActivatedRoute,
              protected override service: SoftwareModulesService,
              public apiResolver: SoftwareSetupResolver
  ) {
    super(activatedRoute, service);
    // this.gridOptions.columnDefs = [
    //   {headerName: 'Name', field: 'name', cellTemplate: BusinessCell },
    //   {headerName: 'License', cellTemplate: BusinessPermissionInfo },
    //   {headerName: 'OperatedBy', field: 'operatedByName'},
    //   {headerName: 'Contact', cellTemplate: BusinessContactGridCell },
    //   {headerName: 'Mobile', field: 'contactPersonMobile' },
    //   {headerName: 'Created Date', field: 'createdDate', cellTemplate: DateFormatCell },
    // ];
  }
  
  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.parent?.params
        .subscribe((parms: { code: string }) =>
        {
          var software = this.apiResolver.lookup.getSoftwareByCode(parms.code);
          this.changeSoftware(software);
        });
  }

  changeSoftware(software: SoftwareLookup) {
    this.software = software;
    this.coreState.softwareId = this.software?.id;
    super.populateGrid();
  }

  hasChildren(module: ModulePermission): boolean {
    return module.children && module.children.length > 0;
  }
}