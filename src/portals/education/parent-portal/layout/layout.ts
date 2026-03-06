import {Component, Injector} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    template: `<router-outlet></router-outlet>`
})
export class LayoutComponent {
    constructor(public injector: Injector, public router: Router, public activeRoute: ActivatedRoute) {}
}
