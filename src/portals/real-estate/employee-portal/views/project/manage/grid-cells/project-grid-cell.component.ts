import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent} from  "@app-global";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-primary text-xs _500" (click)="showDetails(context)"> {{ context?.name }}</a>
        <div><span class="text-xs">{{context.code }}</span><span class=" px-1 text-muted">{{context.shortName}}</span></div>
        <div class="item-except text-xs h-1x">
            <small>
            {{context.phase?.statusType }} : {{context.phase?.phaseName }} <span class="badge purple"> on {{context.phase?.fromDate | dateFormat }} </span>
            </small>

        </div>
    </div>`
})
export class ProjectNameActionCell extends DynamicComponent {
    constructor(private router: Router, public activatedRoute: ActivatedRoute) {
        super();
    }

    showDetails(row) {
      const { isClient } = this.activatedRoute.snapshot.data;
        if (isClient) {
            this.router.navigate(['../', row.id], {relativeTo: this.activatedRoute.parent});
            return
        }
        this.router.navigate(['../', row.id], {relativeTo: this.activatedRoute.parent});
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context?.client?.companyName || context?.client?.name}}</a>
        <div class="d-block text-xs">
            <div class="clearfix px-1"><i class="fa fa-envelope"></i> Email {{context.client?.email }}</div>
            <div class="clearfix px-1"><i class="fa fa-phone"></i> {{context.client?.phone }}</div>
        </div>
        <!--<div class="item-except text-xs h-1x">
            <span class="text-muted"> {{context.client?.taxRegistrationNo }}</span>
        </div>-->
    </div>`
})
export class ProjectCustomerCell extends DynamicComponent {
    constructor() {
        super();
    }
}
//manager
@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context?.manager?.name}}</a>
        <div class="d-block text-xs">
            <div class="clearfix px-1"><i class="fa fa-envelope"></i> Email {{context.manager?.email }}</div>
            <div class="clearfix px-1"><i class="fa fa-phone"></i> {{context.manager?.phone }}</div>
        </div>
        <!--<div class="item-except text-xs h-1x">Tax Reg. No<span class="text-muted"> </span></div>-->
    </div>`
})
export class ProjectManagerCell extends DynamicComponent {
    constructor() {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <span class="text-xs">{{context.expectedCost | orgCurrency}}</span>
        <div class="text-xs">
            <small class="pr-1">Est.</small>
            <small class="_600">{{context.expectedStartDate | dateFormat}} </small>
            <small class="px-1">+</small>
            <span class="text-muted">{{ context.expectedDurationDays || '--'}} days</span>
        </div>
        <div class="text-xs">
            <small class="pr-1">Act.</small>
            <small class="_600">{{context.startDate | dateFormat}} </small>
            <small class="px-1">To:</small>
            <span class="badge purple">{{context.endDate | dateFormat}} </span>
        </div>
    </div>`
})
export class ProjectDateInfoCell extends DynamicComponent {
    constructor(private router: Router, public activatedRoute: ActivatedRoute) {
        super();
    }

    showDetails(row) {
        this.router.navigate([row.id], {relativeTo: this.activatedRoute.parent});
    }
}

// service

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context?.quotationInfo?.netAmount ||  '--' }} </a>
        <div class="item-except text-xs h-1x" *ngIf="context?.quotationInfo?.voucherNo"><span class="text-muted">{{ context?.quotationInfo?.voucherNo ||  '--' }}
        <!--{{context?.quotationInfo?.voucherDate }}-->
        </span></div>
    </div>`
})
export class ServiceQuotationCell extends DynamicComponent {
    constructor() {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context?.saleOrderInfo?.netAmount ||  '--' }} </a>
        <div class="item-except text-xs h-1x" *ngIf="context?.saleOrderInfo?.voucherNo">
        <span class="text-muted">{{ context?.saleOrderInfo?.voucherNo ||  'voucherNo' }}
        <!--{{context?.saleOrderInfo?.voucherDate }}-->
        </span></div>
    </div>`
})
export class ServiceSaleOrderCell extends DynamicComponent {
    constructor() {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context?.purchaseOrder?.netAmount ||  '--' }} </a>
        <div class="item-except text-xs h-1x"><span class="text-muted">{{ context?.purchaseOrder?.voucherNo ||  'voucherNo' }}
        <!--{{context?.purchaseOrder?.voucherDate }}-->
        </span></div>
    </div>`
})
export class AssociatePurchaseOrderCell extends DynamicComponent {
    constructor() {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context?.projectModule ||  '--' }} </a>
        <div class="item-except text-xs h-1x"><span class="text-muted"></span></div>
    </div>`
})
export class AssociateProjectNameCell extends DynamicComponent {
    constructor() {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context?.vendorExecutive ||  '--' }} </a>
        <div class="item-except text-xs h-1x"><span class="text-muted"></span></div>
    </div>`
})
export class AssociateVendorCell extends DynamicComponent {
    constructor() {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context?.empExecutive ||  '--' }} </a>
        <div class="item-except text-xs h-1x"><span class="text-muted"></span></div>
    </div>`
})
export class AssociateEmployeeCell extends DynamicComponent {
    constructor() {
        super();
    }
}
