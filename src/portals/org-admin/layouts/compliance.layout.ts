import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  templateUrl: './templates/compliance.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class ComplianceLayout {
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
                { routeTo: ['manage/board'], icon:"fa fa-home", key: 'Compliance Board' },
                { routeTo: ['manage/regulatory'], icon:"fa fa-envelope", key: 'Regulatory' },
            ]
        },
        {
            isFLatChildren: true, key: 'Report',
            children:[
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
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public cdref: ChangeDetectorRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}
