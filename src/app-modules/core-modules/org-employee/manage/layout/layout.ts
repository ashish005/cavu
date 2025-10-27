import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FetchEmployeeService} from "../services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OrgEmployee} from "../domains/org-employee.serializer";

@Component({
  standalone: false,
  templateUrl: './layout-ce.html'
})
export class LayoutCELayout implements OnInit {

    public componentRef: any;
    @Input() id: string;

    get isNewForm() { return this.id; };
    user: OrgEmployee;
    constructor(private fb: FormBuilder,
                public router: Router,
                private activatedRoute: ActivatedRoute,
                public userResolver: FetchEmployeeService) {
    }
    public items : Array<any> = [
        { id:2, icon:"fa fa-dashboard", route: 'info', name: "sideOptions.info", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'documents', name: "sideOptions.documents", sortOrder: 2 },
        // { id:10, icon:"fa fa-user", route: 'executive', name: "sideOptions.executives", sortOrder: 3 },
        // { id:6, icon:"fa fa-calculator", route: 'invoice', name: "sideOptions.invoices", sortOrder: 4 },
        // { id:11, icon:"fa fa-folder-open", route: 'purchase-order', name: "Purchase Order", sortOrder: 5 },
    ];

    activeView: any;
    ngOnInit() {
        if(this.id){
            this.userResolver.resolve({ data: {}, params: { id: this.id }}).then(r => { this.user = this.userResolver.employee; }, ()=> { this.user = null; });
        }
        this.activeView = this.items[0];
    }

    changeView(view){
        this.activeView = view;
    }
}

@Component({
  standalone: false,
  templateUrl: './layout.html'
})
export class OrgEmployeeLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}
