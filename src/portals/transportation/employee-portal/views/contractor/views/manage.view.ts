import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {Contractor, ContractorQueryOptions} from "../domains/contractor.serializer";
import {ContractorService} from "../services/contractor.service";

@Component({
    templateUrl: './templates/manage.html', standalone: false
})
export class ContractorManageView extends ViewExtender<Contractor> implements OnInit, OnDestroy {
  override coreState: ContractorQueryOptions = new ContractorQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: ContractorService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Email', field: 'email' },
            {headerName: 'Phone', field: 'phone' },
            {headerName: 'Vehicles', field: 'ownedVehicles' }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: Contractor) {}
    createNew(){}
}
