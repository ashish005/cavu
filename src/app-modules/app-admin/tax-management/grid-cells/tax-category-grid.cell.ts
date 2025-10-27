import {DynamicComponent} from "@app-global";
import {Component} from "@angular/core";

@Component({
  standalone: false,
    template: `
    <span class="text-right"> {{context.rate}}%  <span *ngIf="context.hasExtraTaxRate"> + Extra {{context.extraTaxRate}}%</span></span>
    <div class="item-except text-xs">
        <ng-template ngFor let-rateMapper [ngForOf]="context.children | sortBy:'asc': 'rate'" let-i="index">
           <div class="d-inline-block text-xs px-1" [class.b-l]="(i!=0)">
            <div class="d-block float-left" [class.text-warning]="!(rateMapper.status)" [class.text-success]="(rateMapper.status)">{{rateMapper.name}}</div>
            <b *ngIf="rateMapper?.hasExtraTaxRate" class="float-left badge badge-pill primary mx-1">+</b>

            <span>{{rateMapper.supplyType}}</span>
          </div>
        </ng-template>
    </div>
`
})
export class TaxRateCellComponent extends DynamicComponent{
}

@Component({
  standalone: false,
    template: `<div class="text-sm-center">
        <ng-template ngFor let-rateMapper [ngForOf]="context.taxTypeRateMapper | sortBy:'asc': 'rate'" let-i="index">
          <a class="d-inline-block px-3 text-center" [class.b-l]="(i!=0)">
          <div class="text-sm d-block">
            <b *ngIf="rateMapper?.hasExtraTaxRate" class="float-left badge badge-pill primary mx-1">+</b>
            <div class="item-title _500 float-left" [class.text-warning]="!(rateMapper.status)" [class.text-success]="(rateMapper.status)">{{rateMapper.name}}</div>
          </div>
          </a>
        </ng-template>
    </div>`
})
export class TaxRateMapperCellComponent extends DynamicComponent{
}
