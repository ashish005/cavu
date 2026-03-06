import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    standalone: false,
  templateUrl: './layout.html',
  styles: [':host ::ng-deep { display: contents; }']
})
export class Layout implements OnInit {
  public actionTemplate: TemplateRef<any>;
  public pageTitleTemplate: TemplateRef<any>;
  public title: string;
  constructor(private activatedRoute: ActivatedRoute){//, private feePlanFactory: FeePlanPluginFactory
      //this.title = this.activatedRoute.snapshot.data.title;
  }

  ngOnInit(){}

  onActivate(componentRef){
    this.pageTitleTemplate = componentRef.pageTitleTemplate;
    this.actionTemplate = componentRef.actionTemplate;
  }

    showFeeTypesMasterPopup=()=> {};//this.feePlanFactory.showFeeTypesMasterPopup(()=>{});

    showConcessionFeeMasterPopup=()=> {};//this.feePlanFactory.showConcessionFeeMasterPopup(()=>{});

    showFeePenaltyMasterPopup=()=> {};//this.feePlanFactory.showFeePenaltyMasterPopup(()=>{});
}

@Component({ standalone: false, templateUrl: './layout1.html' })
export class FeeMasterLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.license',
            children:[
                { route: ['feeType'], icon:"fa fa-home", key: 'fee.feeType' },
                { route: ['penalty'], icon:"fa fa-home", key: 'fee.penalty' },
                { route: ['concession'], icon:"fa fa-home", key: 'fee.concession' }
            ]
        }
    ];
    constructor(public activatedRoute: ActivatedRoute){}

    onActivate(componentRef){
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
        this.actionTemplate = componentRef.actionTemplate;
    }
}
