import {Component, OnInit} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, GridUISwitchCellComponent, SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {Bank, BankQueryOptions} from "../domains/bank.serializer";
import {BankService} from "../services/bank.service";

@Component({
    standalone: false,
    templateUrl: './templates/bank.html',
    styles: [`:host { display: contents; }`],
})
export class BankView extends ViewExtender<Bank> implements OnInit {
    override coreState: BankQueryOptions = new BankQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: BankService,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Country', field: 'countryName'},
            {headerName: 'Required', field: 'isRequired', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ]
    }

    ngOnInit() { super.populateGrid(); }
    actionCb(e){}
}
