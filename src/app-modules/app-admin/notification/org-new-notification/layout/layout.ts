import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
    NotificationMediaTypeTemplate,
    OrgNotification
} from "../domains/notification.serializer";
import {NotificationService} from "../services/notification.service";
import {NotificationAPIResolver} from "../services/api.resolver";

@Component({templateUrl: './templates/layout.html', styles: [`::ng-deep ng-component{ display: contents;}`]})
export class Layout implements OnInit, OnDestroy {
    @ViewChild('actionTemplate', {static: true}) public actionTemplate: TemplateRef<any>;
    activeView: string;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public service: NotificationService, public lookupResolver: NotificationAPIResolver) {}

    ngOnInit(){}
    ngOnDestroy(){}

    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                //{ routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' },
                { routeTo: ['manage'], icon:"fa fa-dashboard", key: 'manage' },
                { routeTo: ['workflow'], icon:"fa fa-dashboard", key: 'workflow' }
            ]
        }
    ];

    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
    }
}