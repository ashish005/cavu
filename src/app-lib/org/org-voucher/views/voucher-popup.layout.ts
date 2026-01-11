import {ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";

@Component({
    standalone: false,
    templateUrl: `./templates/voucher-popup.html`
})
export class VoucherPopupLayout {
    public navList: any = {
        //key: `${translatePath}.nav.sale_group`,
        children: [
            {routeTo: ['print'], icon: "", code: "FIN_DAY", key: 'print' },
            {routeTo: ['conversion'], icon: "", code: "FIN_DAY", key: 'conversion' },
            {routeTo: ['notification'], icon: "", code: "FIN_DAY", key: 'notification' },
            {routeTo: ['history'], icon: "", code: "FIN_DAY", key: 'history' }
        ]
    };
    @ViewChild('popupOptionsTemplate', {static: true}) public popupOptionsTemplate: TemplateRef<any>;

    @ViewChild('docPrint') docPrint;
    @ViewChild('voucher') public voucher: any;
    @Input() data;
    tabs: any = {
        'ce': 'ce',
        'review': 'review',
        'notify': 'notify',
        'history': 'history'
    };
    activeTab: string = this.tabs.ce;
    @Output() onOk: EventEmitter<boolean> = new EventEmitter<boolean>();

    voucherType: any;
    constructor(private cdr: ChangeDetectorRef){ }
    onTabChange(tab: string) {
        const { id, voucherMasterType } = this.data;
        this.activeTab = tab;
        // Allow the view to render the component before accessing it
        setTimeout(() => {
            if (tab === this.tabs.ce && this.voucher) {
                if (!id) {
                    this.voucher.populateVoucherByMasterType(voucherMasterType);
                } else {
                    this.voucher.populateVoucherById(voucherMasterType, id);
                }
            } else if (tab === this.tabs.review) {
                this.docPrint.populateReport({
                    voucherId: id,
                    voucherMasterType: voucherMasterType
                }, null);
            }
        }, 100);
    }

    ngOnInit(){
        this.onTabChange(this.activeTab);
    }

    callback(e){
        this.onOk.emit(e);
    }
}