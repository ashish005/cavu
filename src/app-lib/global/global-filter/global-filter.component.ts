import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService, AppSetup, AppSetupService} from "@app-global";

@Component({
    standalone: false,
  templateUrl: './templates/global-filter.html',
  styles: [`:host { display: contents;}`]
})
export class GlobalFilterComponent implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  orgSetup: AppSetup;

  @Input() id: string;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(public fb: FormBuilder, public alertService: AlertService, public setupService: AppSetupService) {}

  ngOnInit(){
      this.orgSetup = this.setupService.appSetup;
      const { id, branches, countryId } = this.orgSetup;
      const mainBranch = (branches || []).find(r => r.isHeadBranch);
      // this.customForm.patchValue({
      //     orgUnitId: id,
      //     orgBranchId: branch?.id || mainBranch?.id,
      //     countryId: countryId,
      //     //orgSessionId: this.coreService.orgSessionId
      // });
  }

    refreshAndApplyMaster(branch)
    {
        //const { id, isMasterSeedApplied } = branch;
        const success = ()=> {
            this.alertService.stopLoadingMessage();
            branch.isMasterSeedApplied = true;

            setTimeout(() => { location.href = location.href; }, 100);
        };
        const failure = ()=> {
            this.alertService.stopLoadingMessage();
        };
        this.alertService.startLoadingMessage('Progress', `Master seed initiated...`);
        const v = this.setupService.seederOrgBranchAsync(branch.id);
        v.toPromise().then(success, failure);
    }
}