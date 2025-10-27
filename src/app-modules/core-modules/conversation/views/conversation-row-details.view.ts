import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ConversationService} from "../services/conversation.service";
import {Conversation} from "../domains/conversation.serializer";
import {CoreResponse} from "@app-global";

@Component({
  standalone: false,
    templateUrl: './templates/conversation-row-details.html'
})
export class ConversationRowDetailsView implements OnInit, OnDestroy {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    key: string;
    //serviceSubscription: Subscription;
    isLoading: boolean;
    conversation: Conversation;
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public service: ConversationService){
    }

    ngOnInit() {
      const { key } = this.activatedRoute.snapshot.params;
      this.key = key;
        const success = (resp: CoreResponse<Conversation>) => {
            this.isLoading = false;
            this.conversation = resp.data;
        };
        const failure = (e) => {
            this.isLoading = false;
        };
        this.isLoading = true;
        //this.serviceSubscription = this.service.read(this.activatedRoute.snapshot.params.id).subscribe(success, failure);
    }

    ngOnDestroy(){
        //this.serviceSubscription.unsubscribe();
    }
    navigateBack(){
        this.router.navigate(['./', this.key], {relativeTo: this.activatedRoute.parent});
    }
}
