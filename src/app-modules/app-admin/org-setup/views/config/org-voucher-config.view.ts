import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/org-voucher-config.html'
})
export class OrgVoucherConfigView implements OnInit{
    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    leftFeatures = [
        { name: 'General', sortOrder: 1,
            features: [
                { name: 'Enable supplementary details', desc: 'Address details, dispatch details etc.', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: '', sortOrder: 2,
            features: [
                { name: 'Allow separate buyer and consignee names', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Allow modification of all fields during entry', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: '', sortOrder: 3,
            features: [
                { name: 'Allow ledgers grouped under provision', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Use defaults for bill allocations', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Provide additional descriptions for stock item name', desc: null, sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Provide additional descriptions for ledger name', desc: 'For accounting invoice', sortOrder: 4, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: '', sortOrder: 4,
            features: [
                { name: 'Consolidate stock items with same rates', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Show compound unit of item based on rate', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive',
                    features: [
                        { name: 'Show full details of compound unit', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }
                    ]
                },
                { name: 'Show turnover archived with customer', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' }
            ]
        },
        { name: "Exporter's Options", sortOrder: 5,
            features: [
                { name: 'Provide export shipping details', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Provide marks and numbers/ container no.', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive'},
                { name: 'Provide number and kind of packages', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' }
            ]
        }
    ];

    rightFeatures = [
        { name: 'Inventory', sortOrder: 1,
            features: [
                { name: 'Warn on negative stock balance', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Warn on duplicate order number', sortOrder: 2, type: 'checkbox', value: false, status: 'inactive' },
                { name: 'Provide complete accounting allocations in order/delivery note', sortOrder: 3, type: 'checkbox', value: false, status: 'inactive' },
            ]
        },
        { name: 'Statutory', sortOrder: 2,
            features: [
                { name: 'Calculate tax on current sub-total',  desc: 'By default, Calculations are on inventory total only', sortOrder: 1, type: 'checkbox', value: false, status: 'inactive' }
            ]
        }
    ];
    ngOnInit(){}
}