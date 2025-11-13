import {
    Component,
    OnInit,
    AfterViewInit, Input, OnDestroy, ViewChild, TemplateRef, ChangeDetectorRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {OrgProcessService} from "../services/org-process.service";

@Component({
    standalone: false,
    templateUrl: './templates/org-process.html',
    styles: [`:host { display: contents; }`],
    providers: [OrgProcessService]
})
export class OrgProcessView implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('processCe') public processCe?: any;
    @ViewChild('phaseTransition') public phaseTransition?: any;

    @Input() parentId: any;
    @Input() id: any;
    tabs: any = {
        'main': 'main',
        'transitionRules': 'transitionRules'
    };
    activeTab: string = this.tabs.main;
    subscribe: Subscription;
    data: any;
    isLoading: boolean = false;
    constructor(private cdr: ChangeDetectorRef, private service: OrgProcessService){ }

    onTabChange(tab: string) {
        this.activeTab = tab;
        // Allow the view to render the component before accessing it
        setTimeout(() => {
            if (tab === this.tabs.main && this.processCe) {
                this.processCe.populateOrgProcess(this.data);
            } else if (tab === this.tabs.transitionRules && this.phaseTransition) {
                this.phaseTransition.populateOrgProcess(this.data);
            }
        });
    }

    ngOnInit(){
        if(this.id) {
            this.isLoading = true;
            this.subscribe = this.service.read(this.id).subscribe(r => {
                this.isLoading = false;
                this.data = r.data;
                this.onTabChange(this.activeTab);
            }, ()=> { this.isLoading = false; });
        }
    }

    ngOnDestroy(){ this.subscribe?.unsubscribe(); }
}
