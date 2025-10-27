import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, take} from "rxjs";

@Component({
    templateUrl: './templates/layout.html', standalone: false
})
export class Layout implements OnInit {
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}

    ngOnInit() {}
    onActivate(componentRef) {}
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});

    // goBackToEmployeePortal = () => this.router.navigate(['app'], {relativeTo: this.activatedRoute.root});
    goBackToEmployeePortal = () => null;
}
