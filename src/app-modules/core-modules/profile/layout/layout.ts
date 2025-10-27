import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ASIDE_CLASS, ASIDE_SIZE } from "@app-global";

@Component({
  standalone: false,
  templateUrl: './layout.html',
  styles: [`:host { display: contents;}`]
})
export class ProfileLayout implements OnInit {
 user:  any;
  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
  }

  showPopup(data: any){
    const popup = {
      header: { text: `Profile :  ${ data.name }`, desc: 'Active Profile' },
      aside: ASIDE_CLASS.RIGHT,
      size: ASIDE_SIZE.W_50
    };

    const inputData: any = {
      id: data.id,
      data: data
    };
    // let modal$ = this.sharedService.showCustomPopup(SchedulerInfoComponent, popup, inputData);
    // modal$.then((resp)=>{
    //   this.sharedService.destroy();
    // }, (err)=>{
    //   this.sharedService.destroy();
    // });
  }

  ngOnInit(){}
}
