import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {
    ASIDE_CLASS,
    ASIDE_SIZE,
    DateFormatCell, FullDateFormatCell,
    GridUISwitchCellComponent,
    SharedService,
    ViewExtender
} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgHostConfig, OrgHostConfigQueryOptions} from "../domains/org-host-config.serializer";
import {OrgHostConfigService} from "../services/org-host.service";
import {OrgService} from "../services/org.service";
import {HostConfigCEComponent} from "../components/host-config-edit.component";

@Component({
    standalone: false,
    templateUrl: './templates/org-host.html',
    styles: [`:host { display: contents; }`]
})
export class OrgHostView extends ViewExtender<OrgHostConfig> implements OnInit {
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    override coreState: OrgHostConfigQueryOptions = new OrgHostConfigQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public orgService: OrgService,
                public override service: OrgHostConfigService,
                public sharedService: SharedService) {
        super(activatedRoute, service);
        //this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Host', field: 'hostName' },
            {headerName: 'Tenant Point', field: 'tenantPoint' },
            {headerName: 'Enable', field: 'enable', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'UnderConstruction', field: 'isUnderConstruction', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Created On', field: 'createdDate', cellTemplate: FullDateFormatCell }
        ];
        this.coreState.tenantId = this.orgService.org.tenant.id;
    }
    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(data: OrgHostConfig){
        const inputData: any = {
            id: data.id,
            data: data
        };

        this.showConfigPopup(inputData, { text: `Edit HostConfig`, desc: '' });
    }

    addHost(){
        const hostConfig = new OrgHostConfig();

        const inputData: any = {
            id: null,
            data: hostConfig
        };

        this.showConfigPopup(inputData, { text: `Org Host Config`, desc: '' });
    }

    showConfigPopup(inputData: any, header){
        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any) => {
            this.sharedService.destroy();
            super.populateGrid();
        };

        const error = (err: any) => {
            this.sharedService.destroy();
        };
        let modal$ = this.sharedService.showCustomPopup(HostConfigCEComponent, popup, inputData);
        modal$.then(success, error);
    }
}