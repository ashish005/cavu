import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudentInformationService} from "../../services/student-information.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SharedService} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './user-information.html',
  styles: [`:host { display: contents;}`]
})
export class UserInformationView implements OnInit {
  private title: string;
  isNewForm: boolean = true;
  customForm: FormGroup;
  public componentRef: any;
  public userId: string;

  constructor(public router: Router, private activatedRoute: ActivatedRoute){
    //this.title = this.activatedRoute.snapshot.data.title;
    //this.userId = coreService.currentUser.id;
  }

  ngOnInit(){
    /*this.service.getBatchList(this.coreState).subscribe(r => {
      this.batch = r.entities;
    }, err=>{
    });*/
    //this.service.read(param.id).subscribe(performAction, failure);
  }

  updateOrgImage(img){}

  onActivate(componentRef){
    this.componentRef = componentRef;
  }
}
