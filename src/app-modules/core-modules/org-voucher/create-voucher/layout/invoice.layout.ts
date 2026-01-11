import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

const translatePath = 'modules.project.sub_module';
@Component({
  standalone: false,
  template: `<voucher-ce #voucher></voucher-ce>`
})
export class VoucherCreateLayout implements OnInit {
    @ViewChild('voucher', { static: true }) public voucher: any;
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public injector: Injector) {}

    ngOnInit() {
        const { hasVoucherId } = this.activatedRoute.snapshot.data;
        const { voucherId, voucherMasterType } = this.activatedRoute.snapshot.params;
        this.activatedRoute.paramMap.subscribe(params => {
            const myParam = params.get('voucherMasterType');
            if (!hasVoucherId) {
                this.voucher.populateVoucherByMasterType(myParam);
            } else {
                this.voucher.populateVoucherById(myParam, voucherId);
            }
        });
    }

    routeToUrl=(item)=> this.router.navigate([item.key], {relativeTo: this.activatedRoute.parent});
}
