import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactAPIResolver} from "../services/api.resolver";
import {UserTypeLookup} from "../domains/lookup.serializer";

@Component({
    standalone: false,
  templateUrl: './layout.html',
  styles: [`:host { display: contents;}`]
})
export class ContactsLayout implements OnInit {
  public actionTemplate: TemplateRef<any>;
  constructor(private router: Router,
              public activatedRoute: ActivatedRoute,
              public lookupResolver: ContactAPIResolver) {
  }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }

  ngOnInit(){}

    showUserType(userType:  UserTypeLookup){
        this.router.navigate([userType.masterType], {relativeTo: this.activatedRoute});
    }
}
