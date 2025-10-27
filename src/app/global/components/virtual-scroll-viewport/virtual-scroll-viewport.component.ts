import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {CommonModule} from "@angular/common";
import {DynamicContentComponent} from "../responsive-table/table.component";

@Component({
  selector: 'virtual-scroll-viewport',
  templateUrl:'./virtual-scroll-viewport.html', standalone: true, imports: [CommonModule, ScrollingModule, DynamicContentComponent]
 /* styles: [`:host cdk-virtual-scroll-viewport {
    height: 100%;
    table {
      height: 100%;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

    thead {
          tr {
            th {
              height: 59px;
              border-bottom: 1px solid #d0d0d0;
              padding: 7px 20px 7px 7px;
              position: sticky;
              background-color: #ffffff;
              top: 0;
            }
          }
        }
    }`]*/
})
export class VirtualScrollViewportComponent {
  @Input() list: Array<any>;
  @Input() rowTemplate: any;
  constructor(){}

  @ViewChild(CdkVirtualScrollViewport)
  public viewPort: CdkVirtualScrollViewport;

  public get inverseTranslation(): string {
    if (!this.viewPort || !this.viewPort["_renderedContentTransform"]) {
      return "translateY(0px)";
    }
    return this.viewPort["_renderedContentTransform"].replace(/translateY\((\d+)px\)/, "translateY(-$1px)");
  }

}
