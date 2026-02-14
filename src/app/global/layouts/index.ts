import {Component} from "@angular/core";
import {SetupLayout} from "./setup.layout";

@Component({ template: `<router-outlet></router-outlet>`, standalone: false })
export class AdminSetupLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['org-setup'], icon:"fa fa-institution", key: 'Org setup' },
                { routeTo: ['role-permission-setup/role-module'], icon:"fa fa-envelope", key: 'Role & Permissions' },
                { routeTo: ['subscription'], icon:"fa fa-leaf", key: 'Subscription' },
            ]
        },
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['module-access-setup'], icon:"fa fa-user-circle", key: 'User Access Setup' }
            ]
        },
        {
            isFLatChildren: true, key: 'Regulations Tracker',
            children:[
                { routeTo: ['tax-management'], icon:"fa fa-money", key: 'Tax management' },
                { routeTo: ['payroll'], icon:"fa fa-check-square-o", key: 'Payroll' }
            ]
        },
        {
            isFLatChildren: true, key: 'Teams, Workflow & Logs',
            children:[
                { routeTo: ['org-team'], icon:"fa fa-building", key: 'Team' },
                { routeTo: ['notification'], icon:"fa fa-bell", key: 'Notification' },
                { routeTo: ['setup-trxn'], icon:"fa fa-cc-visa", key: 'Bank' },
                { routeTo: ['bank-trxn'], icon:"fa fa-cc-visa", key: 'Bank Integration' }
            ]
        },
        {
            name: "Others", isFLatChildren: true,
            children:[
                { routeTo: ['integration'], icon:"fa fa-graduation-cap", key: 'Other Integration' },
                { routeTo: ['quiz'], icon:"fa fa-question-circle", key: 'Quiz' }
            ]
        }
    ];
}

@Component({ template: `<router-outlet></router-outlet>`, standalone: false })
export class AdminProcessLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'dashboard' },
                { routeTo: ['master/tree'], icon:"fa fa-envelope", key: 'Org Workflow' },
                { routeTo: ['setup'], icon:"fa fa-bell", key: 'Setup' }
            ]
        },
        {
            isFLatChildren: true, key: 'Process Instance',
            children:[
                { routeTo: ['instance/info'], icon:"fa fa-envelope", key: 'Process' },
                { routeTo: ['instance/task-runner'], icon:"fa fa-envelope", key: 'Task Runner' },
            ]
        },
        {
            isFLatChildren: true, key: 'Schedule',
            children:[
                { routeTo: ['instance/scheduled'], icon:"fa fa-bell", key: 'Task Schedule' },
                { routeTo: ['instance/task-reminder'], icon:"fa fa-bell", key: 'reminder' },
                //{ routeTo: ['task-calendar'], icon:"fa fa-bell", key: 'calendar' },
            ]
        },
        {
            isFLatChildren: true, key: 'Other',
            children:[
                { routeTo: ['instance/history'], icon:"fa fa-bell", key: 'History' },

            ]
        }
    ];
}

@Component({ template: `<router-outlet></router-outlet>`, standalone: false })
export class AdminComplianceLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['manage/dashboard'], icon:"fa fa-dashboard", key: 'dashboard' }
            ]
        },
        {
            isFLatChildren: true, key: 'Management',
            children:[
                { routeTo: ['manage/list'], icon:"fa fa-home", key: 'Compliance' },
                { routeTo: ['manage/regulatory'], icon:"fa fa-envelope", key: 'Regulatory' },
            ]
        },
        {
            isFLatChildren: true, key: 'Report',
            children:[
                { routeTo: ['manage/board'], icon:"fa fa-home", key: 'Compliance Board' },
                { routeTo: ['report'], icon:"fa fa-history", key: 'Compliance report' }
            ]
        },
        {
            isFLatChildren: true, key: 'Other',
            children:[
                { routeTo: ['manage/scheduler'], icon:"fa fa-home", key: 'Test Scheduler' }
            ]
        }
    ];
}

@Component({ template: `<router-outlet></router-outlet>`, standalone: false })
export class AdminLogLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children: [
                {routeTo: ['error'], icon: "fa fa-inbox", key: "Error Log"},
                {routeTo: ['data'], icon: "fa fa-paper-plane", key: "Data Log"},
                {routeTo: ['org-task'], icon: "fa fa-trash", key: "Org Task Log"},
            ]
        }
    ];
}

@Component({ template: `<router-outlet></router-outlet>`, standalone: false })
export class AdminAccountLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children: [
                {routeTo: ['accounting/dashboard'], icon: "fa fa-dashboard", key: "Dashboard"},
                {routeTo: ['accounting/ledger'], icon: "fa fa-list-alt", key: "Ledgers"},
                {routeTo: ['accounting/book'], icon: "fa fa-book", key: "Books"},
                {routeTo: ['accounting/report'], icon: "fa fa-pie-chart", key: "Reports"},
                {routeTo: ['accounting/trxn'], icon: "fa fa-exchange", key: "Transactions"},
                {routeTo: ['accounting/setup'], icon: "fa fa-cog", key: "Setup"},
            ]
        }
    ];
}

export {SetupLayout} from "./setup.layout";
export const ADMIN_LAYOUTS = [
    AdminComplianceLayout, AdminLogLayout, AdminProcessLayout, AdminSetupLayout, AdminAccountLayout, SetupLayout
];