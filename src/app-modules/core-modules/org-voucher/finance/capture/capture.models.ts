// Document capture (api/v1/finance/capture/*): bills and receipts read by OCR (or typed in), reviewed and converted.

export type CapturePurpose = 'Bill' | 'PaidExpense' | 'Journal';
export type CaptureStatus = 'Queued' | 'Processing' | 'Review' | 'Converted' | 'Discarded' | 'Failed';
export type CaptureView = 'inbox' | 'review' | 'converted' | 'discarded' | 'all';

export const CAPTURE_PURPOSE_LABEL: Record<CapturePurpose, string> = {Bill: 'Bill to pay later', PaidExpense: 'Already paid', Journal: 'Journal (no vendor)'};
export const CAPTURE_STATUS_LABEL: Record<CaptureStatus, string> = {
    Queued: 'Waiting', Processing: 'Reading', Review: 'To review', Converted: 'Done', Discarded: 'Discarded', Failed: 'Failed'
};
export const CAPTURE_STATUS_TONE: Record<CaptureStatus, string> = {
    Queued: 'grey', Processing: 'info', Review: 'warn', Converted: 'success', Discarded: 'grey', Failed: 'danger'
};
/** Upload types the readers understand; others are attached and typed in. */
export const CAPTURE_ACCEPT = '.pdf,.png,.jpg,.jpeg,.tif,.tiff,image/*,application/pdf';

export interface CaptureProvider { code: string; label: string; description: string; available: boolean; simulated: boolean; }
export interface CaptureSettings {
    provider: string; defaultPurpose: CapturePurpose; autoCreateDraft: boolean; confidenceThreshold: number; defaultExpenseAccountId: string | null;
    defaultMoneyAccountId: string | null; defaultPaymentModeId: number | null; roundingTolerance: number; providers: CaptureProvider[];
}

export interface CaptureRow {
    id: string; fileName: string; purpose: CapturePurpose; status: CaptureStatus; provider: string; vendorName: string | null; party: string | null;
    documentNumber: string | null; documentDate: string | null; total: number | null; currencyCode: string | null; confidence: number | null;
    isDuplicate: boolean; voucherId: string | null; error: string | null; uploadedAt: string;
}
export interface CaptureField { key: string; label: string | null; value: string | null; confidence: number; }
export interface CaptureLine {
    id: string; lineNo: number; description: string; quantity: number; unitPrice: number; amount: number; accountId: string | null; account: string | null;
    taxCodeId: string | null; itemId: string | null; suggestedBy: string | null;
}
export interface Capture {
    row: CaptureRow; vendorTaxId: string | null; dueDate: string | null; currencyRate: number | null; subTotal: number | null; taxAmount: number | null;
    partyAccountId: string | null; moneyAccountId: string | null; paymentModeId: number | null; notes: string | null; text: string | null;
    fields: CaptureField[]; lines: CaptureLine[]; duplicateOf: string | null; duplicateOfVoucherId: string | null; duplicateOfCaptureId: string | null;
    paymentVoucherId: string | null; convertedAt: string | null; problems: string[]; linesTotal: number;
}

export interface CaptureLineInput { description: string; quantity: number; unitPrice: number; amount: number; accountId: string | null; taxCodeId: string | null; itemId: string | null; }
export interface CaptureInput {
    purpose: CapturePurpose; vendorName: string | null; vendorTaxId: string | null; documentNumber: string | null; documentDate: string | null; dueDate: string | null;
    currencyCode: string | null; currencyRate: number | null; subTotal: number | null; taxAmount: number | null; total: number | null;
    partyAccountId: string | null; moneyAccountId: string | null; paymentModeId: number | null; notes: string | null; lines: CaptureLineInput[];
}
export interface CaptureConvertResult { capture: Capture; voucherId: string; message: string; }
export interface CaptureUploadResult { items: CaptureRow[]; problems: string[]; }
