import {Component} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CoreLayout, SetupLayout} from "./setup.layout";
import {PreSetupLayout} from "./pre-setup.layout";

@Component({
    template: `<router-outlet></router-outlet>`,
    standalone: true,
    imports: [RouterModule]
})
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

export { CoreLayout, SetupLayout} from "./setup.layout";
export {PreSetupLayout} from "./pre-setup.layout";

export const ADMIN_LAYOUTS = [
    PreSetupLayout, SetupLayout, CoreLayout
];
