import { Component, Input, OnInit } from "@angular/core";
import { ModulePermission } from "../domains/module-permission.serializer";

@Component({
  selector: 'module-permission-grid',
  templateUrl: './templates/module-permission-grid.html',
  standalone: false
})
export class ModulePermissionGridComponent implements OnInit {
  @Input() permissions: Array<ModulePermission> = [];
  
  ngOnInit() {
    // Component initialization
  }

  hasChildren(module: ModulePermission): boolean {
    return module.children && module.children.length > 0;
  }
}
