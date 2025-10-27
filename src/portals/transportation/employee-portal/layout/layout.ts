import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";

@Component({
  templateUrl: './templates/layout.html',
  standalone: true,
  imports: [CommonModule, GlobalModule, RouterModule]
})
export class MainLayout implements OnInit {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' }
            ]
        },
        {
            isFLatChildren: false, key: 'mainLayout.heading.vehicle',
            children:[
                { routeTo: ['vehicle'], icon:"fa fa-bell", key: 'vehicle' },
                { routeTo: ['contractor'], icon:"fa fa-bell", key: 'Contractor' },
                { routeTo: ['vehicle/payout'], icon:"fa fa-bell", key: 'Payout' },
                { routeTo: ['contractor/payment'], icon:"fa fa-bell", key: 'Payment' }
            ]
        },
        {
            isFLatChildren: false, key: 'mainLayout.heading.vehicleInspection',
            children:[
                { routeTo: ['vehicle/inspection'], icon:"fa fa-bell", key: 'Inspection' }
            ]
        },
        {
            isFLatChildren: false, key: 'mainLayout.heading.driver',
            children:[
                { routeTo: ['driver'], icon:"fa fa-bell", key: 'driver' },
                { routeTo: ['driver/payout'], icon:"fa fa-bell", key: 'driver_payout' },
                { routeTo: ['driver/payment'], icon:"fa fa-bell", key: 'driver_payment' }
            ]
        },
        {
            isFLatChildren: true, key: 'mainLayout.heading.booking',
            children:[
                { routeTo: ['booking/rcpt'], icon:"fa fa-bell", key: 'booking_receipt' },
                { routeTo: ['booking/tracker'], icon:"fa fa-bell", key: 'tracker' }
            ]
        }
    ];
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public cdref: ChangeDetectorRef){}

    ngOnInit() {}

    onActivate(componentRef){}

    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});

}
