import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({ templateUrl: './templates/features/org-accounting-feature.html' })
export class OrgAccountingFeatureView implements OnInit{
    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
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

@Component({ templateUrl: './templates/features/org-inventory-feature.html' })
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

@Component({ templateUrl: './templates/features/org-voucher-config.html' })
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

@Component({ templateUrl: './templates/features/org-voucher-entry-config.html' })
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