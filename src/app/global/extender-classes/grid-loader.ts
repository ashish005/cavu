import {Observable, Subscription, catchError, take} from "rxjs";
import {Directive, Injector, OnDestroy, OnInit} from "@angular/core";
import {TranslationService } from "@app-global";
import {CoreEndpointBase} from "../services/endpoint-base.service";

@Directive()
export class GridLoaderComponent extends CoreEndpointBase implements OnInit, OnDestroy {
    isLoading: boolean = false;
    data: any;
    entities: Array<any>;
    queryOption: any;
    count: number = 0;

    hasError: boolean = false;
    errorMsg: string;
    subscriber: Subscription;
    gT = (key: string | Array<string>, interpolateParams?: Object) => this.translationService.getTranslation(key, interpolateParams);

    public translationService: TranslationService;
    portlet: any;
    header = { title: '', desc: '' };
    constructor(override injector: Injector, public portletKey, public resource: string) {
        super(injector);
        this.translationService= injector.get(TranslationService);
    }

    ngOnInit() {
        this.header.title = this.portlet.name || this.gT(`dashboard.grid.${this.portlet.code}.title`);
        this.header.desc = this.portlet.description || this.gT(`dashboard.grid.${this.portlet.code}.desc`);
        this.callService();
    }

    callService() {
        //const { orgUnitId, orgBranchId, id } = this.coreService.currentUser;

        this.queryOption.portletId = this.portlet.id;
        // this.queryOption.orgUnitId = orgUnitId;
        // this.queryOption.orgUserId = id;

        this.isLoading = true;
        this.count = 0;

        const success = (result)=> {
            this.isLoading = false;
            this.data = result.data;
            this.entities = result.entities;
            this.hasError = false;
            this.errorMsg = null;
        };

        const failure = (result)=> {
            this.isLoading = false;
            this.hasError = true;
            const { message, error } = result;
            this.errorMsg = error?.message || message;
        };

        this.subscriber = this.httpClient
            .get(`${this.baseSectorAPIUrl}${this.resource}?${this.queryOption.toQueryString()}`, this.requestHeaders)
            .pipe(
                take(1),
                catchError((error => super.handleError(error, null)))
            ).subscribe(success, failure);
    }

    ngOnDestroy(){
        this.subscriber?.unsubscribe();
    }
}
