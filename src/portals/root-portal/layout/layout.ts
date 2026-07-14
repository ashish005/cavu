import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, take} from "rxjs";
import {AuthService} from "@app-third-party";

@Component({
  templateUrl: './templates/layout.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class Layout implements OnInit  {
  public actionTemplate: TemplateRef<any>;
  country: any;
  constructor(public router: Router, public authService: AuthService,public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}

  public navList: Array<any> = [
    {
      name: "Main", isFLatChildren: true,
      children:[
        { routeTo: ['business'], icon:"fa fa-graduation-cap", name: "Business", key: 'Business' },
        { routeTo: ['pricing'], icon:"fa fa-graduation-cap", name: "pricing", key: 'pricing' },
        { routeTo: ['trial'], icon:"fa fa-graduation-cap", name: "Setup Business", key: 'Setup Business' }
      ]
    },
    /*{
        name: "Others", isFLatChildren: true,
        children:[
            { routeTo: ['master'], icon:"fa fa-graduation-cap", name: "Master Types", key: 'Master Types' }
        ]
    }*/
  ];

    ngOnInit() {}
    onActivate(componentRef){
      this.actionTemplate = componentRef.actionTemplate;
    }

    ngAfterContentChecked() { this.cdref.detectChanges(); }

    logout = () => this.authService.logout();

  showGlobalFilterPopup(){
    /*const inputData: any = {
      countryId: null,
      actionType: ACTION_ENUM.SHOW
    };
    const popup = {
      header: { text: `Select Country`, desc: `Select Country` },
      aside: ASIDE_CLASS.RIGHT,
      size: ASIDE_SIZE.W_50
    };

    const success = (data)=> {
      const { countryId, country } = data;
      this.country = this.apiResolver.masterType.findCountryById(countryId);
      this.router.navigate([countryId],{relativeTo: this.activeRoute});
      // changes the route without moving from the current view or
      // this.router.navigate(['refresh'], { skipLocationChange: true });
      // setTimeout ((url) => {
      //     this.router.navigateByUrl(url, { /!* Removed unsupported properties by Angular migration: relativeTo, queryParamsHandling. *!/ skipLocationChange: false });
      // }, 10, this.router.url);
      this.sharedService.destroy();
    };
    const errorCb = (err)=> { this.sharedService.destroy(); };

    let modal$ = this.sharedService.showCustomPopup(OrgCountryComponent, popup, inputData);
    modal$.then(success, errorCb);*/
  }
}
