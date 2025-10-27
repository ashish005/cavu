import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './layout.html'
})
export class LayoutComponent {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['error'], icon:"fa fa-inbox", key: "Error Log" },
                { routeTo: ['data'], icon:"fa fa-paper-plane", key: "Data Log" },
                { routeTo: ['org-task'], icon:"fa fa-trash", key: "Org Task Log" },
            ]
        }
    ];
  constructor(private router: Router, public activatedRoute: ActivatedRoute){}
}
