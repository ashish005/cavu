import {CanActivateFn, Router, RouterModule, ROUTES, Routes} from '@angular/router';
import {AppHomeView} from "./views-app/app-home.view";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GlobalModule, TypingComponent} from "@app-global";

@NgModule({
    imports: [
        ReactiveFormsModule, CommonModule, // Add CommonModule to imports
        FormsModule, RouterModule, TypingComponent,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: '', redirectTo: 'home', pathMatch: 'full'},
                    {path: 'home', component: AppHomeView, data: { title: 'Home - EnRator | Digital Transformation & IT Solutions' }},
                ]
            }
        ]), GlobalModule
    ],
    declarations: [ AppHomeView ]
})
export class OrgCompanyModule { }
