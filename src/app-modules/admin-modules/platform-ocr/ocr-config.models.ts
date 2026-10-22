// Platform › OCR providers (api/v1/platform/ocr-providers): which OCR providers each country uses. Root users only.

/** A provider the platform offers: what it reads and which settings it uses (`endpoint`, `model`, `options:<key>`…). */
export interface OcrProviderInfo {
    code: string; label: string; engine: string; description: string; accepts: string[]; uses: string[]; secretLabel: string | null;
    defaultEndpoint: string | null; defaultModel: string | null; simulated: boolean;
}

/** A stored row (never the secret: only whether one is set and its last characters). `countryCode` `*` = every country. */
export interface OcrConfigRow {
    id: string; countryCode: string; provider: string; label: string; isEnabled: boolean; priority: number; useForComparison: boolean; endpoint: string | null;
    model: string | null; extractModel: string | null; region: string | null; options: Record<string, string>; hasSecret: boolean; secretHint: string | null;
    maxPages: number; concurrency: number; timeoutSeconds: number; notes: string | null; modifiedDate: string | null;
}

/** `secret`: null keeps the stored one, '' removes it. */
export interface OcrConfigInput {
    countryCode: string; provider: string; isEnabled: boolean; priority: number; useForComparison: boolean; endpoint: string | null; model: string | null;
    extractModel: string | null; region: string | null; options: Record<string, string>; secret: string | null; maxPages: number; concurrency: number;
    timeoutSeconds: number; notes: string | null;
}

/** What a country ends up with per provider; `source` is the country, `*`, `default` (built in) or `none`. */
export interface OcrEffective {
    provider: string; label: string; source: string; enabled: boolean; ready: boolean; missing: string | null; priority: number; useForComparison: boolean;
    model: string | null; hasSecret: boolean;
}

export interface OcrConfigList { providers: OcrProviderInfo[]; rows: OcrConfigRow[]; countries: string[]; country: string | null; effective: OcrEffective[]; }

/** Labels and hints of the settings a provider may use. */
export const OCR_SETTING_LABEL: Partial<Record<string, {label: string; hint?: string}>> = {
    endpoint: {label: 'Endpoint', hint: 'Base URL, https://'},
    model: {label: 'Model'},
    extractModel: {label: 'Field extraction model', hint: 'A text model with JSON schema output that turns the OCR text into fields; empty uses the label rules.'},
    region: {label: 'Region / location', hint: 'us or eu for Google'},
    'options:apiVersion': {label: 'API version'},
    'options:projectId': {label: 'Project id'},
    'options:processorId': {label: 'Processor id', hint: 'An Invoice Parser processor'},
    'options:effort': {label: 'Effort', hint: 'low, medium or high'},
    'options:prompt': {label: 'OCR prompt', hint: 'Default: Convert the document to markdown.'},
    'options:retryPrompt': {label: 'Retry prompt', hint: 'Used once when a page loops or is cut off. Default: Free OCR.'},
    'options:maxTokens': {label: 'Max tokens per page', hint: 'Default 4096'},
    'options:dpi': {label: 'Render DPI', hint: 'Default 150'},
    'options:maxEdge': {label: 'Max image edge (px)', hint: 'Default 1600'}
};
