import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/org-inventory-feature.html'
})
export class OrgInventoryFeatureView implements OnInit{
    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    leftFeatures = [
        { name: 'General', sortOrder: 1,
            features: [
                { name: 'Integrate accounts & inventory', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Enable zero-valued transactions', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: 'Storage and Classification', sortOrder: 2,
            features: [
                { name: 'Maintain multiple Godowns', sortOrder: 1, type: 'checkbox', value: false, status: 'active' },
                { name: 'Maintain stock categories', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Maintain batch-wise details', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive',
                    features: [ { name: 'Set expiry dates for batches', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }]
                },
                { name: 'Use separate actual and billed quantity columns', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: 'Order Processing', sortOrder: 3,
            features: [
                { name: 'Enable purchase order processing', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Enable sales order processing', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Enable job order processing', desc: 'Enable \'Storage and Classification -> Maintain multiple Godowns\' & use in and out vouchers', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }
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
                },
                { name: 'Use separate discount column in invoices', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
            ]
        },
        { name: 'Purchase Management', sortOrder: 2,
            features: [
                { name: 'Track additional costs of purchases', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: 'Sales Management', sortOrder: 3,
            features: [
                { name: 'Use multiple price levels', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: 'Other Features', sortOrder: 4,
            features: [
                { name: 'Use tracking numbers', desc:'Enables delivery  and receipt notes', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use rejection inward and outward notes', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use material in and out vouchers', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use cost tracking for stock item', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' }
            ]
        }
    ];
    ngOnInit(){}
}