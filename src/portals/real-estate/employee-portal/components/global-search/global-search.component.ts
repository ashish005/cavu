import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalSearchLookupService} from "./services/global-search-api.resolver";

@Component({
  selector: 'global-search',
  templateUrl: './global-search.html',
  styleUrls:  [`./global-search.scss`],
  providers: [GlobalSearchLookupService],
  standalone: false
})
export class GlobalSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  search = {
    categories: [
      { name:  'Process & Task' },
      { name:  'Student' },
      { name:  'Employee' },
      { name:  'Course' }
    ]
  };
  constructor(private el: ElementRef, public router: Router,
              public activeRoute: ActivatedRoute,
              public serviceLookup: GlobalSearchLookupService){}

  ngOnInit() {
    this.serviceLookup.fetch();
    let el = this.el.nativeElement;
    let input = el.querySelector('.search__input');
    var inputWidth = input.offsetWidth;
    var suggestion = el.querySelector('.suggestion');
    var mobileSearch = el.querySelector('.search__icon');
    var menu = el.querySelector('.menu');
    //var logo = el.querySelector('.logo');
    //var logoIcon = logo.querySelector('.logo__icon');

    this.equalWidth();
    input.addEventListener('focus', function () {
      let suggestion = el.querySelector('.suggestion');
      suggestion.classList.add('active');
    });

    function openMobileSearch() {
      //logo.classList.toggle('hide-element');
      menu.classList.toggle('hide-element');
      input.classList.toggle('mobile-search');
      mobileSearch.classList.toggle('ion-ios-search');
      mobileSearch.classList.toggle('ion-close-round');
      mobileSearch.classList.toggle('close-icon');
    }

    mobileSearch.addEventListener('click', function() {
      openMobileSearch();
    })
  }

  equalWidth() {
    /*let el = this.el.nativeElement;
    var input = el.querySelector('.search__input');
    var suggestion = el.querySelector('.suggestion');

    suggestion.style.width = input.offsetWidth + "px" ;*/
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let el = this.el.nativeElement;
    let suggestion = el.querySelector('.suggestion');
    suggestion.style.width = '';
    this.equalWidth();
  }

  close(){
    let el = this.el.nativeElement;
    let suggestion = el.querySelector('.suggestion');
    if(suggestion.classList.contains('active')) {
      suggestion.classList.remove('active');
    }
  }

  cbFilter(data){}
}
