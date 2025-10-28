import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    standalone: false,
  templateUrl: './layout.html',
  styles: [`:host { display: contents;}`]
})
export class PermissionLayout implements OnInit {
  public actionTemplate: TemplateRef<any>;
  page: any;
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['role-module'], icon:"fa fa-envelope", key: 'Role & Permissions' },
                { routeTo: ['users'], icon:"fa fa-envelope", key: 'Portal Access' }
            ]
        }
    ];
  constructor(private router: Router, public activatedRoute: ActivatedRoute) {
    this.page = this.activatedRoute.snapshot.data;
  }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }

  ngOnInit(){}
}
