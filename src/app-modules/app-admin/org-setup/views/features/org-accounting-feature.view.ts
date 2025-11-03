import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/org-accounting-feature.html'
})
export class OrgAccountingFeatureView implements OnInit{
    constructor(public activatedRoute: ActivatedRoute){
    }

    leftFeatures = [
        { name: 'General', sortOrder: 1,
            features: [
                { name: 'Maintain accounts only', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Integrate accounts & inventory', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use Income and Expenses A/c instead of Profit & Loss A/c', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Enable multi-currency', sortOrder: 4, type: 'checkbox', value: false, status: 'active' },
            ]
        },
        { name: 'Outstanding Management', sortOrder: 2,
            features: [
                { name: 'Maintain bill-wise details', sortOrder: 1, type: 'checkbox', value: false, status: 'active',
                    features: [ { name: 'For non-trading accounts also', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                },
                { name: 'Activate interest calculation', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [ { name: 'Use advanced parameters', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                }
            ]
        },
        { name: 'Cost/Profits Centers Management', sortOrder: 3,
            features: [
                { name: 'Maintain payroll', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Maintain cost centers', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [
                        { name: 'Use cost center for job costing', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                        { name: 'Maintain more than one payroll/ cost category', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                        { name: 'Use pre-defined cost-center allocations in transactions', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                        { name: 'Show opening balance for revenue items in reports', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' },
                    ]
                }
            ]
        },
    ];

    rightFeatures = [
        { name: 'Invoicing', sortOrder: 1,
            features: [
                { name: 'Enable invoicing', sortOrder: 1, type: 'checkbox', value: false, status: 'active',
                    features: [ { name: 'Record purchases in invoice mode', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                },
                { name: 'Use debit and credit notes', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [
                        { name: 'Record credit notes in invoice mode', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                        { name: 'Record debit notes in invoice mode', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' }
                    ]
                }
            ]
        },
        { name: 'Budget and Scenario Management', sortOrder: 2,
            features: [
                { name: 'Maintain budget and controls', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use reversing journals and optional voucher', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: 'Banking Features', sortOrder: 3,
            features: [
                { name: 'Enable cheque printing', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Set/alter transaction types', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Set/alter banking features', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Set/alter post-dated transaction features', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: 'Other Features', sortOrder: 3,
            features: [
                { name: 'Enable zero-valued transactions', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Maintain multiple mailing details for company and ledgers', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [
                        { name: 'Set/alter company mailing details', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                    ]
                },
                { name: 'Enable company logo', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Mark changed vouchers', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' },
            ]
        }
    ];

    ngOnInit(){}
}