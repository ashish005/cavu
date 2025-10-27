import {
    Component,
    EventEmitter,
    Input, OnInit,
    Output
} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";

@Component({
  selector: 'org-logo',
  templateUrl:'./org-logo.html',
  styles: [`:host{ display: contents; }`],
  standalone: true, // Mark as standalone
  imports: [RouterModule], // Include any dependencies here
})
export class OrgLogoComponent {
  @Input() logoColor;
  constructor(public router: Router, public activatedRoute: ActivatedRoute){}
  routeToRoot=()=> this.router.navigate(['app', 'dashboard'], { relativeTo: this.activatedRoute.root });
}
