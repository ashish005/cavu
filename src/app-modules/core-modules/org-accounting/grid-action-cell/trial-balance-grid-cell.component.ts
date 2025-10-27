import {Component, Input} from "@angular/core";
import { DynamicComponent } from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500" (click)="showDetails(context)">{{ context?.head }}</a>`
})
export class TrialAccountNameCell extends DynamicComponent{
    constructor(public router: Router, public activatedRoute: ActivatedRoute){ super(); }

    showDetails(row: any){
        const { id } = row;
        this.router.navigate([ 'ledger-report-monthly', id], { relativeTo: this.activatedRoute.parent });
    }
}

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500" (click)="showDetails(context)">{{ context?.head }}</a>`
})
export class TrialAccountGroupNameCell extends DynamicComponent{
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute){ super(); }

    showDetails(row){
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { groupId: row.id },
            queryParamsHandling: 'merge' // or 'preserve'
        });
    }
}
