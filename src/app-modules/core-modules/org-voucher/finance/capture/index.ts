// Document capture inside the finance workspace (api/v1/finance/capture/*): scanned bills and receipts.
import {CaptureApiService} from './capture-api.service';

export * from './capture.models';
export * from './capture-api.service';
export {FinanceCaptureInboxView} from './views/capture-inbox.view';
export {FinanceCaptureSettingsView} from './views/capture-settings.view';
export {FinanceCaptureReportView} from './views/capture-report.view';
export {FinanceCaptureLogView} from './views/capture-log.view';
export {CaptureCompareComponent} from './views/capture-compare.component';

export const CAPTURE_SERVICES = [CaptureApiService];
