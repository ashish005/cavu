import { Component, OnInit } from "@angular/core";
import {
  Router,
  Event,
  ActivationEnd,
  NavigationEnd,
  ActivatedRoute,
  RoutesRecognized,
  RouterModule
} from "@angular/router";
import { distinctUntilChanged, filter, map } from "rxjs";
import {CommonModule} from "@angular/common";

export interface BreadcrumbComponent {
  label: string;
  url: string;
}
/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.html',
  standalone: true, imports: [ CommonModule, RouterModule ]
})

export class BreadcrumbComponent {
  breadcrumbs$;
  breadcrumbsData$;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    /**
     * navigationEnd$ is triggered once per completed routing event, in other words
     * once per loading a component that is in the end of the current route
     */
    const navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));
    const activationEndEnd$ = this.router.events.pipe(filter(isActivationEnd));

    /**
     * Here we subscribe to all navigation events, in order to update
     * our route "data", which we will use for the breadcrumb visualization.
     *
     * Than we filter the events emitted from the `router` in such way, that we are only
     * taking action upon a completed router event (in other words we are subscribing only for `ActivationEnd`
     * events)
     *
     * We use pluck to get only the required breadcrumb data
     *
     * The buffer operator accumulates all `data` coming from the router and emits the accumulated data once
     * when a `NavigationEnd` event passes trough `navigationEnd$`
     *
     * The `map` in the end is used to reverse the collected data, in order to convert it to more logical
     * sequence. Without the revers first we will get the data for the current route, after that for it's parent
     * and so on (that is how the ng router works).
     */
    // this.breadcrumbs$ = this.router.events.pipe(
    //   filter(isNavigationEnd),
    //   distinctUntilChanged(),
    //   map(event => this.buildBreadCrumb(this.activatedRoute.root))
    // );
    this.router.events.pipe(
      //filter(isNavigationEnd),
      distinctUntilChanged(),
      map(event => this.buildBreadCrumb(this.activatedRoute.root))
    ).subscribe((r)=>{ this.breadcrumbs$ = r; });

  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadcrumbComponent> = []): Array<BreadcrumbComponent> {
    // If no routeConfig is available we are on the root path
    const label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['title'] : null;
    const path = route.routeConfig ? route.routeConfig.path : '';

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = `${url}${path}/`.replace('//', '/');
    const breadcrumb = <BreadcrumbComponent>{label: label, url: nextUrl};
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs.filter((r)=> r.label);
  }
}
