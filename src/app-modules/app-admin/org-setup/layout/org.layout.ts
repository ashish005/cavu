import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";

@Component({
    standalone: false,
    templateUrl: './templates/org.html'
})
export class OrgLayout {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    navList: Array<any> = [
        {
            //id:'setting',
            key: `General `, isFLatChildren: false,
            children:[
                { id:1, icon:"fa fa-dashboard", routeTo: 'info', key: `Info`, sortOrder: 1 },
                { id:1, icon:"fa fa-dashboard", routeTo: 'brand-image', key: `Brand Image`, sortOrder: 1 },
                { id:2, icon:"fa fa-dashboard", routeTo: 'host', key: `Host`, sortOrder: 2 },
                { id:3, icon:"fa fa-dashboard", routeTo: 'branch', key: `Branch`, sortOrder: 3 },
                // { id:4, icon:"fa fa-dashboard", routeTo: 'language', key: `Language`, sortOrder: 4 },
                // { id:5, icon:"fa fa-dashboard", routeTo: 'currency', key: `Currency`, sortOrder: 5 },
                { id:6, icon:"fa fa-dashboard", routeTo: 'office', key: `Office Setting`, sortOrder: 6 }
            ]
        }
    ];
    onActivate(e){
        this.actionTemplate = e.actionTemplate;
        //this.navList = e.navList;
    }
}