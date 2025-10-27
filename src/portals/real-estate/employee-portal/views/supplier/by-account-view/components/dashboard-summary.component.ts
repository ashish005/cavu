import {Component, Injector, Input, OnInit} from "@angular/core";
import {catchError, take} from "rxjs/operators";
import {CoreEndpointBase} from "@app-global";

@Component({
    selector: 'dashboard-summary',
    templateUrl: './templates/dashboard-summary.html',
    styles: [`:host { display: contents;}`],
  standalone: false
})
export class DashboardSummaryComponent extends CoreEndpointBase implements OnInit {
    isLoading: boolean;
    data: any;
    hasError: boolean;
    errorMsg: any;
    @Input() id: string;
    @Input() lookfor: string;
    @Input() type: string;

    constructor(public override injector: Injector) {
        super(injector);
       /* this.apiResolver.$synchFilterViews.subscribe((r)=> {
            this.callService();
        });*/
    }

    ngOnInit() {
        this.callService();
    }

    callService(){
        this.isLoading = true;
        const success = (result)=> {
            this.isLoading = false;
            this.data = result.data;
            this.hasError = false;
            this.errorMsg = null;
        };

        const failure = (result)=> {
            this.isLoading = false;
            this.hasError = true;
        };
        this.getSummaryByType(this.lookfor, this.id, this.type).subscribe(success, failure);
    }

    getSummaryByType(lookfor, id, type){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}${lookfor}Dashboard/${id}/${type}`, this.requestHeaders)
            .pipe(
                take(1),
                catchError(error=> this.handleError(error, () => this.getSummaryByType(lookfor, id, type)))
            );
    }
}
