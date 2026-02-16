import {Component} from "@angular/core";
import {SetupLayout} from "./setup.layout";

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

export {SetupLayout} from "./setup.layout";
export const ADMIN_LAYOUTS = [
    AdminLogLayout, SetupLayout
];