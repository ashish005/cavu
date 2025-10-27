import {ErrorHandler, Injectable} from '@angular/core';
import {AlertService} from "../alert/index";

@Injectable()
export class AppErrorHandler extends ErrorHandler {
    constructor(private alertService: AlertService) {
        super();
    }

    override handleError(error: any) {
        //this.alertService.showStickyMessage("Unhandled Error", err.message || err, MessageSeverity.error, err);
        /*if (confirm('Fatal Error!\nAn unresolved error has occured. Do you want to reload the page to correct this?\n\nError: ' + error.message))       {
            window.location.reload();
        }*/
        super.handleError(error);
    }
}
