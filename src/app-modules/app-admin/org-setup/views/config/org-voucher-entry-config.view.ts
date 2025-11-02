import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/org-voucher-entry-config.html'
})
export class OrgVoucherEntryConfigView implements OnInit{
    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    leftFeatures = [
        { name: 'Accounts', sortOrder: 1,
            features: [
                { name: 'Skip Date field during creation for faster entry', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use single entry mode for payment/receipt/contra vouchers', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use payment/receipt as  contra voucher', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use Cr/ Dr instead of To/By during entry', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Enable cheque printing for contra voucher', sortOrder: 5, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Warn on negative cash balance', sortOrder: 6, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Pre-allocate bills for payment/receipt/journal voucher', sortOrder: 7, type: 'checkbox', value: false, status: 'inactive' },
            ]
        },
        { name: '', sortOrder: 2,
            features: [
                { name: 'Allow cash accounts in journal vouchers', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Allow expenses/ fixed assets in purchase vouchers', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use income accounts in sales vouchers', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: '', sortOrder: 3,
            features: [
                { name: 'Show inventory details', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Show table of bills for selection', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [ { name: 'Show final balances of bills', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                },
                { name: 'Show bill-wise details', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive',
                    features: [ { name: 'Expand into multiple lines', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                },
                { name: 'Show current balances of ledgers', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive',
                    features: [ { name: 'Show balances as on voucher date', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                }
            ]
        },
    ];
    rightFeatures = [
        { name: 'Inventory', sortOrder: 1,
            features: [
                { name: 'Provide reference number in stock journal', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Show compound unit of item based on rate', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [ { name: 'Show full details of compound unit', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                },
                { name: 'Warn on negative stock balance', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Show balances as on voucher date', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Show Godown-wise details', sortOrder: 5, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Show batch-wise details', sortOrder: 6, type: 'checkbox', value: false, status: 'inactive' },
            ]
        }
    ];
    ngOnInit(){}
}