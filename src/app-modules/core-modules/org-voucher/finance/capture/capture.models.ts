// Document capture (api/v1/finance/capture/*): bills and receipts read by OCR (or typed in), reviewed and converted.

export type CapturePurpose = 'Bill' | 'PaidExpense' | 'Journal' | 'SalesInvoice';
export type CaptureStatus = 'Queued' | 'Processing' | 'Review' | 'Converted' | 'Discarded' | 'Failed';
export type CaptureView = 'inbox' | 'review' | 'converted' | 'discarded' | 'all';

export const CAPTURE_PURPOSE_LABEL: Record<CapturePurpose, string> = {
    Bill: 'Bill to pay later', PaidExpense: 'Already paid', Journal: 'Journal (no vendor)', SalesInvoice: 'Our sales invoice (customer)'
};
export const CAPTURE_STATUS_LABEL: Record<CaptureStatus, string> = {
    Queued: 'Waiting', Processing: 'Reading', Review: 'To review', Converted: 'Done', Discarded: 'Rejected', Failed: 'Failed'
};
export const CAPTURE_STATUS_TONE: Record<CaptureStatus, string> = {
    Queued: 'grey', Processing: 'info', Review: 'warn', Converted: 'success', Discarded: 'grey', Failed: 'danger'
};
/** Upload types the readers understand (the server's list replaces this once settings load); others are attached and typed in. */
export const CAPTURE_ACCEPT = '.pdf,.png,.jpg,.jpeg,.tif,.tiff,.bmp,.gif,.webp,.heic,.docx,.xlsx,.csv,.tsv,.txt,.md,.html,.htm,.xml,.json';

/** A reader as the organisation's country has it: ready or not (setup says what is missing), simulated, file types, order. */
export interface CaptureProvider {
    code: string; label: string; engine: string; description: string; available: boolean; simulated: boolean; setup: string | null; accepts: string[];
    priority: number; countryCompare: boolean;
}
export interface CaptureSettings {
    provider: string; defaultPurpose: CapturePurpose; autoCreateDraft: boolean; confidenceThreshold: number; defaultExpenseAccountId: string | null;
    defaultMoneyAccountId: string | null; defaultPaymentModeId: number | null; roundingTolerance: number; compareProviders: string[]; compareOnUpload: boolean;
    countryCode: string | null; maxFileMb: number; extensions: string[]; providers: CaptureProvider[];
}

// ---------- Comparing readers ----------

export type ReadingStatus = 'Queued' | 'Processing' | 'Done' | 'Failed';
export type CompareStatus = 'agree' | 'majority' | 'conflict' | 'single' | 'missing';
export const COMPARE_STATUS_LABEL: Record<CompareStatus, string> = {agree: 'All agree', majority: 'Majority', conflict: 'Disagree', single: 'One reader', missing: 'Not read'};
export const COMPARE_STATUS_TONE: Record<CompareStatus, string> = {agree: 'success', majority: 'info', conflict: 'danger', single: 'grey', missing: 'grey'};

export interface CaptureReadLine { description: string; quantity: number; unitPrice: number; amount: number; }
export interface CaptureReading {
    id: string; provider: string; label: string; engine: string; status: ReadingStatus; simulated: boolean; primary: boolean; error: string | null;
    durationMs: number | null; confidence: number | null; lineCount: number; linesTotal: number | null; completedAt: string | null;
    lines: CaptureReadLine[]; fields: CaptureField[]; text: string | null;
}
export interface CompareCell { provider: string; value: string | null; confidence: number | null; agrees: boolean | null; }
export interface CompareField {
    key: string; label: string; status: CompareStatus; consensus: string | null; agreeing: number; answered: number; current: string | null;
    currentMatches: boolean | null; cells: CompareCell[];
}
export interface CaptureComparison {
    captureId: string; readings: CaptureReading[]; fields: CompareField[]; alignment: number | null; conflicts: string[]; runnable: CaptureProvider[]; running: boolean;
}

export interface ProviderStat {
    provider: string; label: string; engine: string; simulated: boolean; readings: number; succeeded: number; failed: number; avgDurationMs: number | null;
    avgConfidence: number | null; agreement: number | null; accuracy: number | null; checked: number; fieldAccuracy: Record<string, number | null>;
}
export interface DocumentStat { captureId: string; fileName: string; status: CaptureStatus; uploadedAt: string; providers: number; alignment: number | null; conflicts: string[]; }
export interface ProviderReport {
    from: string; to: string; documents: number; compared: number; avgAlignment: number | null; providers: ProviderStat[]; recent: DocumentStat[];
    fieldKeys: {key: string; label: string}[]; rejections: {reason: string; label: string; count: number}[];
}

export interface CaptureRow {
    id: string; fileName: string; purpose: CapturePurpose; status: CaptureStatus; provider: string; vendorName: string | null; party: string | null;
    documentNumber: string | null; documentDate: string | null; total: number | null; currencyCode: string | null; confidence: number | null;
    isDuplicate: boolean; voucherId: string | null; error: string | null; uploadedAt: string; rejectReason: string | null;
}
/** A check on what was read: errors must be accepted before converting. */
export interface CaptureCheck { code: string; severity: 'error' | 'warning' | 'info'; field: string | null; message: string; }
export interface RejectReason { code: string; label: string; needsNote: boolean; }
export interface CaptureField { key: string; label: string | null; value: string | null; confidence: number; }
export interface CaptureLine {
    id: string; lineNo: number; description: string; quantity: number; unitPrice: number; amount: number; accountId: string | null; account: string | null;
    taxCodeId: string | null; itemId: string | null; suggestedBy: string | null; code: string | null; unit: string | null; taxRate: number | null; isExempt: boolean;
}
/** A tax read on the document mapped to the books. Status: matched, nearest, suggested, unmatched, manual. */
export interface CaptureTaxLine {
    id: string; lineNo: number; component: string; rate: number | null; taxableAmount: number | null; amount: number; label: string | null; taxCodeId: string | null;
    taxCode: string | null; taxCodeName: string | null; accountId: string | null; account: string | null; accountGroup: string | null; status: string; note: string | null;
}
export const TAX_STATUS_TONE: Record<string, string> = {matched: 'success', manual: 'primary', nearest: 'warn', suggested: 'info', unmatched: 'danger'};
export interface CaptureTaxCodeOption { id: string; code: string; name: string; rate: number; kind: string; components: string; }
export interface Capture {
    row: CaptureRow; vendorTaxId: string | null; dueDate: string | null; currencyRate: number | null; subTotal: number | null; taxAmount: number | null;
    partyAccountId: string | null; moneyAccountId: string | null; paymentModeId: number | null; notes: string | null; text: string | null;
    fields: CaptureField[]; lines: CaptureLine[]; duplicateOf: string | null; duplicateOfVoucherId: string | null; duplicateOfCaptureId: string | null;
    paymentVoucherId: string | null; convertedAt: string | null; problems: string[]; linesTotal: number;
    vendorCountry: string | null; vendorRegion: string | null; buyerName: string | null; buyerTaxId: string | null; documentType: string | null;
    placeOfSupply: string | null; poNumber: string | null; paymentTerms: string | null; discount: number | null; shipping: number | null;
    amountPaid: number | null; balanceDue: number | null; details: Record<string, string>; taxLines: CaptureTaxLine[]; taxNotes: string[];
    taxSystem: string | null; partyRole: 'vendor' | 'customer';
    checks: CaptureCheck[]; rejectReason: string | null; rejectReasonLabel: string | null; rejectNote: string | null; rejectedBy: string | null; rejectedAt: string | null;
}

export interface CaptureLineInput {
    description: string; quantity: number; unitPrice: number; amount: number; accountId: string | null; taxCodeId: string | null; itemId: string | null;
    code: string | null; unit: string | null; taxRate: number | null; isExempt: boolean;
}
export interface CaptureInput {
    purpose: CapturePurpose; vendorName: string | null; vendorTaxId: string | null; documentNumber: string | null; documentDate: string | null; dueDate: string | null;
    currencyCode: string | null; currencyRate: number | null; subTotal: number | null; taxAmount: number | null; total: number | null;
    partyAccountId: string | null; moneyAccountId: string | null; paymentModeId: number | null; notes: string | null; lines: CaptureLineInput[];
    buyerName: string | null; buyerTaxId: string | null; documentType: string | null; placeOfSupply: string | null; poNumber: string | null; paymentTerms: string | null;
}
export interface CaptureConvertResult { capture: Capture; voucherId: string; message: string; }
export interface CaptureUploadResult { items: CaptureRow[]; problems: string[]; }

// ---------- Parties read on the document ----------

export interface PartyTaxIdInput { type: string; countryCode: string | null; value: string | null; isPrimary: boolean; }
export interface PartyAddressInput { type?: string; line1: string; line2: string | null; city: string; region: string | null; postalCode: string | null; countryCode: string | null; isPrimary: boolean; }
/** The parties API's PartyDto, as much as capture fills in. */
export interface PartyProposal {
    kind: string; displayName: string; legalName: string | null; email: string | null; phone: string | null; website: string | null; countryCode: string;
    currencyCode: string | null; notes: string | null; addresses: PartyAddressInput[]; taxIds: PartyTaxIdInput[]; vendor: any; customer: any; [key: string]: any;
}
export interface PartyCandidate { accountId: string; name: string; number: string | null; score: number; reason: string; }
export interface PartyMatch { role: 'vendor' | 'customer'; candidates: PartyCandidate[]; proposal: PartyProposal; linkedAccountId: string | null; linkedName: string | null; }

// ---------- OCR log ----------

export interface OcrRun {
    id: string; captureId: string; readingId: string | null; provider: string; providerLabel: string; model: string | null; operation: string; attempt: number;
    status: 'succeeded' | 'running' | 'failed' | 'error'; startedAt: string; durationMs: number; pages: number | null; inputTokens: number | null; outputTokens: number | null;
    retries: number; fileName: string; contentType: string; sizeBytes: number | null; fields: number; lineItems: number; taxLines: number; confidence: number | null;
    total: number | null; error: string | null;
}
export interface OcrLogStat { provider: string; label: string; calls: number; succeeded: number; failed: number; avgMs: number | null; pages: number; inputTokens: number; outputTokens: number; }
export interface OcrLog { entities: OcrRun[]; count: number; stats: OcrLogStat[]; }
export const RUN_STATUS_TONE: Record<string, string> = {succeeded: 'success', running: 'info', failed: 'danger', error: 'warn'};
