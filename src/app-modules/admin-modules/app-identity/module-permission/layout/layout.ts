import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    standalone: false,
  templateUrl: './layout.html',
  styles: [`:host { display: contents;}`]
})
export class PermissionLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  page: any;
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['role-module'], icon:"fa fa-envelope", key: 'Role & Permissions' },
                { routeTo: ['users'], icon:"fa fa-envelope", key: 'Portal Access' },
                { routeTo: ['contact'], icon:"fa fa-envelope", key: 'App Users' }
            ]
        }
    ];
  constructor(private router: Router, public activatedRoute: ActivatedRoute) {
    this.page = this.activatedRoute.snapshot.data;
  }

    onActivate(componentRef){}

  ngOnInit(){}
}
