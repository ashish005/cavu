import {
  Component, ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {LoaderComponent} from "../loader/loader.component";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";
import {DateFormat, DateHourMinFormat} from "../../pipes/app-pipes/date-format.pipe";
import {OrgCurrencyPipe, VoucherCurrencyPipe} from "../../pipes/app-pipes/currency.pipe";
declare var Slip: any;

export abstract class DynamicComponent {
    context: any;
    lookup: any;
    col: any;
    contentId: string;
    index: number;
    cb: EventEmitter<any>;
}

@Component({ selector: 'dynamic-content', template: `<div #container></div>`, standalone: true })
export class DynamicContentComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  @Input() component: any;

  @Input() context: any;
  @Input() lookup: any;
  @Input() col: any;
  @Input() contentId: string;
  @Input() index: number;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  private componentRef: ComponentRef<{}>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if (this.component) {
      let factory = this.componentFactoryResolver.resolveComponentFactory(<any>this.component);
      this.componentRef = this.container.createComponent(factory);

      // set component context
      let instance = <DynamicComponent> this.componentRef.instance;
      instance.context = this.context;
      instance.lookup = this.lookup;
      instance.col = this.col;
      instance.contentId = this.contentId;
      instance.index = this.index;
      instance.cb = this.cb;
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}

@Component({ selector: 'org-grid', templateUrl: './table.html', styleUrls: [`table.scss`], standalone: true, imports: [CommonModule, LoaderComponent, DynamicContentComponent] })
export class TableComponent implements OnInit {
  // paged items
  pagedItems: any[];
  @Input() data!: Array<any>;
  @Input() options: {
      header: { title: null, desc: null, add: false, refresh: false, edit: true, delete: false },
      total: 0,
      hasNext: false,
      hasPrevious: false,
      isOrderable: false,
      columnDefs: Array<any>
  };
  @Input() isLoading: boolean = false;
  @Input() hasError?: boolean;
  @Input() errorMsg?: string;

  @Output() cb: EventEmitter<any> = new EventEmitter(true);
  @Output() cbRemove: EventEmitter<any> = new EventEmitter(true);
  @Output() orderUpdateCb: EventEmitter<any> = new EventEmitter(true);

  constructor(public el: ElementRef) {}

  ngOnInit(){}

  performAction(rowData: any){
    this.cb.emit(rowData);
  }

  checkValue(row: any){
    row.isChecked = !row.isChecked;
  }

  checkUncheckAll(){}

  remove(row: any){
    this.cbRemove.emit(row);
  }
}

@Component({
    template: `<a [ngClass]="col.class" [ngbPopover]="content" placement="auto"
   [popoverTitle]="context.name" container="body" triggers="manual" [autoClose]="true" #p="ngbPopover" (click)="p.toggle()">Audit</a>
   <ng-template #content>
    <div class="text-xs _500">
        <div>Created: <span class="text-warn">{{ context[col?.field]?.createdBy | slice:0:6 }}</span>  {{ context[col?.field]?.createdDate | date: 'MMM d, y, h:mm:ss a' }}</div>
        <div>Modified: <span class="text-warn">{{ context[col?.field]?.modifiedBy | slice:0:6 }}</span> {{ context[col?.field]?.modifiedDate | date: 'MMM d, y, h:mm:ss a' }}</div>
    </div>
  </ng-template>`,
  standalone: true, imports: [CommonModule, NgbPopoverModule]
})
export class UserAuditInfoCell extends DynamicComponent { constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); } }


@Component({
    template: `<i [class]="(context[col?.field]) ? 'fa fa-check-square-o text-success': 'fa fa-square-o'"></i>`, standalone: true
})
export class GridUISwitchCellComponent extends DynamicComponent {
    /*update(event){
        event.checked = !!this.context[this.col.field];
    }*/
}

@Component({
    template: `<span *ngIf="context.parentId>0" class="float-right">{{ context[col?.field] }}</span>
  <span *ngIf="!context?.parentId" class="float-left">{{ context[col?.field] }}</span>`,
  standalone: true, imports: [ CommonModule ]
})
export class NameCellComponent extends DynamicComponent {
}

@Component({
    template: '<span class="avatar circle"><img [src]="context?.profileUrl" alt="."></span>', standalone: true
})
export class UserImageComponent extends DynamicComponent{
    constructor(){
        super();
    }
}

@Component({
  standalone: true,
  template: `<span class="text-sm _500 text-right float-right" [class]="(context[col?.field] < 0) ? 'text-danger': ''">
        {{ context[col?.field] }}
     </span>`
})
export class NumberCell extends DynamicComponent {
  constructor(){super();}
}

@Component({
  standalone: true,
  template: `<span class="text-sm _500 text-right float-right">
        {{ context[col?.field] | voucherCurrency : context[col?.currencyCodeField] }}
    <!--{{ context[col?.field] | currency: 'CAD':'symbol-narrow' : '1.2-2' }}-->
     </span>`,
  imports: [ VoucherCurrencyPipe ]
})
export class InvoiceCurrencyCell extends DynamicComponent {
  constructor(){super();}
}

@Component({
  standalone: true,
  template: `<span class="text-sm _500 text-right float-right" [class]="(context[col?.field] < 0) ? 'text-danger': ''">
        {{ context[col?.field] | orgCurrency }}
    <!--{{ context[col?.field] | currency: 'CAD':'symbol-narrow' : '1.2-2' }}-->
     </span>`,
  imports: [ OrgCurrencyPipe ]
})
export class CurrencyCell extends DynamicComponent {
  constructor(){super();}
}

@Component({
  standalone: true,
  selector: 'full-date-format-cell',
  template: `<span class="text-xs _500">{{ context[col?.field] | fullDateFormat }}</span>`,
  imports: [ DateHourMinFormat ]
})
export class FullDateFormatCell extends DynamicComponent{
  constructor(){super();}
}

@Component({
  standalone: true,
  selector: 'date-format-cell',
  template: `<span class="text-xs _500">{{ context[col?.field] | dateFormat }}</span>`,
  imports: [ DateFormat ]
})
export class DateFormatCell extends DynamicComponent{
  constructor(){super();}
}
