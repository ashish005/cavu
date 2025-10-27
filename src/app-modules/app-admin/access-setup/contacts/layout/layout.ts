import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactAPIResolver} from "../services/api.resolver";
import {UserTypeLookup} from "../domains/lookup.serializer";

@Component({
  templateUrl: './layout.html',
  styles: [`:host { display: contents;}`]
})
export class ContactsLayout implements OnInit {
  public actionTemplate: TemplateRef<any>;
  page: any;
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public lookupResolver: ContactAPIResolver) {
    this.page = this.activatedRoute.snapshot.data;
  }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }

  ngOnInit(){}

    showUserType(userType:  UserTypeLookup){
        this.router.navigate([userType.masterType], {relativeTo: this.activatedRoute});
    }
}
