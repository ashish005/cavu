import {ErrorHandler, Injectable} from '@angular/core';
import {AlertService} from "../alert/index";
import {DiagnosticsService} from "../../components/support-center/diagnostics.service";

@Injectable()
export class AppErrorHandler extends ErrorHandler {
    constructor(private alertService: AlertService, private diagnostics: DiagnosticsService) {
        super();
    }

    override handleError(error: any) {
        //this.alertService.showStickyMessage("Unhandled Error", err.message || err, MessageSeverity.error, err);
        /*if (confirm('Fatal Error!\nAn unresolved error has occured. Do you want to reload the page to correct this?\n\nError: ' + error.message))       {
            window.location.reload();
        }*/
        // Kept for support tickets ("what else is sent with your report").
        try { this.diagnostics.recordError(error); } catch { /* never fail error handling */ }
        super.handleError(error);
    }
}
