import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgLanguageService} from "../../services/org-language.service";
import {OrgLanguage, OrgLanguageQueryOptions} from "../../domains/org-language.serializer";
import {OrgSetupAPIResolver} from "../../services/api.resolver";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
@Component({
    standalone: false,
    templateUrl: `./templates/org-language.html`
})
export class OrgLanguageView extends ViewExtender<OrgLanguage> implements OnInit {
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    override coreState: OrgLanguageQueryOptions = new OrgLanguageQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: OrgLanguageService, public apiResolver: OrgSetupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Culture Code', field: 'cultureCode' },
            {headerName: 'Enabled', field: 'isEnabled', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Status', field: 'status' }
        ]
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    add(row){
        const { id, isDisplayed, isDefault, name, languageCode, cultureCode } = row;
        const data =  {
            languageId: id,
            name: name,
            languageCode: languageCode,
            cultureCode: cultureCode,
            isEnabled: true,
            isDefault: isDefault,
        };

        this.isLoading = true;
        const success =(resp)=> {
            this.isLoading = false;
            super.populateGrid();
        };
        const failure =(resp)=> { this.isLoading = false; };
        this.service.addOrgLanguage(id, data).toPromise().then(success, failure);
    }

    actionCb(row){
    }
}