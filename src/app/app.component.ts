import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AlertCommand, AlertDialog, AlertService, AppSetupService, DialogType, MessageSeverity} from "@app-global";
import {ToastaConfig, ToastaService, ToastData, ToastOptions} from "ngx-toasta";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SetupFactory} from "@app-lib";

declare var alertify: any;
class ToastaSpecific
{
    protected modalService: NgbModal;

    stickyToasties: number[] = [];
    private toastaService: ToastaService;
    private toastaConfig: ToastaConfig;
    protected alertService: AlertService;

    constructor(public injector: Injector) {
        this.modalService= injector.get(NgbModal);

        this.toastaService= injector.get(ToastaService);
        this.toastaConfig= injector.get(ToastaConfig);
        this.alertService= injector.get(AlertService);

        this.toastaConfig.theme = 'bootstrap';
        this.toastaConfig.position = 'bottom-right';
        this.toastaConfig.limit = 2;
        this.toastaConfig.showClose = true;
        this.toastaConfig.showDuration = true;

        this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
        this.alertService.getMessageEvent().subscribe(message => this.showToast(message));
    }

    showDialog(dialog: AlertDialog) {
        alertify.set({
            labels: {
                ok: dialog.okLabel || "Ok",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });

        switch (dialog.type) {
            case DialogType.alert:
                alertify.alert(dialog.message);
                break;
            case DialogType.confirm:
                alertify
                    .confirm(dialog.message, (ok) => {
                        if (ok) {
                            dialog.okCallback();
                        } else {
                            if (dialog.cancelCallback) {
                                dialog.cancelCallback();
                            }
                        }
                    });
                break;
            case DialogType.prompt:
                alertify
                    .prompt(dialog.message, (ok, val) => {
                        if (ok) {
                            dialog.okCallback(val);
                        } else {
                            if (dialog.cancelCallback) {
                                dialog.cancelCallback();
                            }
                        }
                    }, dialog.defaultValue);
                break;
        }
    }

    showToast(alert: AlertCommand) {
        if (alert.operation == 'clear') {
            for (const id of this.stickyToasties.slice(0)) {
                this.toastaService.clear(id);
            }
            return;
        }

        const toastOptions: ToastOptions = {
            title: alert.message.summary,
            msg: alert.message.detail,
        };


        if (alert.operation == 'add_sticky') {
            toastOptions.timeout = 0;

            toastOptions.onAdd = (toast: ToastData) => {
                this.stickyToasties.push(toast.id);
            };

            toastOptions.onRemove = (toast: ToastData) => {
                const index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }

                if (alert.onRemove) {
                    alert.onRemove();
                }

                toast.onAdd = null;
                toast.onRemove = null;
            };
        } else {
            toastOptions.timeout = 4000;
        }

        switch (alert.message.severity) {
            case MessageSeverity.default: this.toastaService.default(toastOptions); break;
            case MessageSeverity.info: this.toastaService.info(toastOptions); break;
            case MessageSeverity.success: this.toastaService.success(toastOptions); break;
            case MessageSeverity.error: this.toastaService.error(toastOptions); break;
            case MessageSeverity.warn: this.toastaService.warning(toastOptions); break;
            case MessageSeverity.wait: this.toastaService.wait(toastOptions); break;
        }
    }
}

@Component({
    selector: 'app-body',
    template: `<router-outlet></router-outlet><ngx-toasta></ngx-toasta>`,
    standalone: false
})
export class AppComponent extends ToastaSpecific {
  title = 'Enrator';
  constructor(public override injector: Injector, private setupService: AppSetupService, private setupFactory: SetupFactory) {
    super(injector);
    this.setupService.showGlobalFilterPopup = () => this.setupFactory.showGlobalFilterPopup();

    this.setupService.showBellPopup = () => this.setupFactory.showBellPopup();
    this.setupService.createSupportTicket = () => this.setupFactory.createSupportTicket();
    this.setupService.showSurveyPopup = () => this.setupFactory.showSurveyPopup();
  }
}
