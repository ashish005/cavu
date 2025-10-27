import {SharedService, DynamicComponent} from "@app-global";
import {Component, Input} from "@angular/core";


@Component({
  standalone: false,
    template: `<div>
    {{context.bankName}}
    <div class="item-except text-sm text-muted h-1x">
    {{context.branchName }}
    </div>
</div>`
})
export class BankBranchNameCell extends DynamicComponent{
    show: boolean = false;
    constructor(private sharedService: SharedService){super();}
}

@Component({
  standalone: false,
    template: `<div><small>IFSC:</small> {{context.ifscCode }}<div class="h-1x text-xs"><small>MICR:</small>{{context.micrCode }}</div></div>`
})
export class BankAccountNameCell extends DynamicComponent{
    show: boolean = false;
    constructor(private sharedService: SharedService){super();}
}

@Component({
  standalone: false,
    template: `<div>{{context.bankAccountNo }}<div class="h-1x text-xs"> Id: {{context.accountId}}</div></div>`
})
export class BankAccountNoCell extends DynamicComponent{
    show: boolean = false;
    constructor(private sharedService: SharedService){super();}
}

@Component({
  standalone: false,
    template: `<div><a class="text-xs text-muted">{{context.status}}</a>
        <!--<div class="item-action dropdown">
            <a href="#" data-toggle="dropdown" class="text-muted" data-pjax-state=""><i class="fa fa-fw fa-ellipsis-v"></i></a>
            <div class="dropdown-menu dropdown-menu-right text-color" role="menu">
                <ng-template ngFor let-item [ngForOf]="list" let-j="index">
                    <a class="dropdown-item">{{item.name}}</a>
                </ng-template>
            </div>
        </div>-->
        <div class="h-1x text-xs"><a class="text-xs text-primary">Setup Rules</a></div>
    </div>`
})
export class BankAccountActionCell extends DynamicComponent{
    show: boolean = false;
    list: Array<any> = [
        {name: 'View Transactions'},
        {name: 'Import Statement'},
        {name: 'Manage Transaction Rules'},
        {name: 'Mark as Inactive'},
    ];
    constructor(private sharedService: SharedService){super();}
}

@Component({
  standalone: false,
    template: `<div class="text-xs">{{context.bankAmount}}
        <div class="item-except text-xs h-1x">
            <a class="text-xs text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="cursor-pointer" style="width: 15px;">
                    <path d="M178.3 224.4h155.4c8.8 0 16-7.2 16-16s-7.2-16-16-16H178.3c-8.8 0-16 7.2-16 16s7.1 16 16 16zm0-80h155.4c8.8 0 16-7.2 16-16s-7.2-16-16-16H178.3c-8.8 0-16 7.2-16 16s7.1 16 16 16z"></path>
                    <path d="M496.4 271.9H448v-216c0-30.9-25.1-56-56-56H120c-30.9 0-56 25.1-56 56v216H15.6c-8.8 0-16 7.2-16 16v208.2c0 8.8 7.2 16 16 16h480.8c8.8 0 16-7.2 16-16V287.9c0-8.8-7.2-16-16-16zM96 55.9c0-13.2 10.8-24 24-24h272c13.2 0 24 10.8 24 24v216h-21.7c-4.5 0-8.8 1.9-11.9 5.3l-64 70.7H195.6l-64-70.7c-3-3.3-7.3-5.3-11.9-5.3H96v-216zm384.4 424.2H31.6V303.9h81l64 70.7c3 3.3 7.3 5.3 11.9 5.3h137c4.5 0 8.8-1.9 11.9-5.3l64-70.7h79v176.2z"></path>
                </svg>
                Bank Statements
            </a>
        </div>
    </div>`
})
export class AmountInBankCell extends DynamicComponent{
    constructor(private sharedService: SharedService){super();}
}

@Component({
  standalone: false,
    template: `<div class="text-xs">{{context.bookAmount}}
        <div class="item-except text-xs h-1x">
            <a class="text-xs text-primary"><i class="fa  fa-eye"></i> Transactions</a>
        </div>
    </div>`
})
export class AmountInBookCell extends DynamicComponent{
    constructor(private sharedService: SharedService){super();}
}

@Component({
  standalone: false,
    template: `<div>
        <a class="item-title _500">{{context.name}}</a>
        <div class="item-except text-sm text-muted h-1x">
            <ng-template ngFor let-item [ngForOf]="context?.modes" let-i="index">
                <a class="d-inline-block px-1 b-r text-xs text-center">{{ item?.name }}</a>
            </ng-template>
            <ng-template ngFor let-item [ngForOf]="context?.serviceCharges" let-i="index">
                <a class="d-block">
                    <small class="d-block text-muted mt-0">{{ item | json }}</small>
                </a>
            </ng-template>
        </div>
    </div>`
})
export class PaymentGatewayCell extends DynamicComponent{
    show: boolean = false;
    constructor(private sharedService: SharedService){super();}
}
