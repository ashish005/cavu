import {CoreQueryOptions, CoreResource, CoreSerializer} from "@app-global";

// Settings › Notifications (tenant API api/v1/notification-settings/*).

export type NotifyChannel = 'InApp' | 'Email' | 'Sms' | 'WhatsApp' | 'Push' | 'Slack' | 'Teams';
export type NotifyStatus = 'Pending' | 'Processing' | 'Sent' | 'Failed' | 'Cancelled';
/** UserControlled: members may switch channels off; TenantControlled: only the organisation decides; Mandatory: always sent. */
export type NotifyMode = 'UserControlled' | 'TenantControlled' | 'Mandatory';

export const CHANNEL_LABEL: Record<NotifyChannel, string> = {
    InApp: 'In-app', Email: 'Email', Sms: 'SMS', WhatsApp: 'WhatsApp', Push: 'Push', Slack: 'Slack', Teams: 'Teams'
};
export const CHANNEL_ICON: Record<NotifyChannel, string> = {
    InApp: 'fa-bell', Email: 'fa-envelope', Sms: 'fa-comment', WhatsApp: 'fa-whatsapp', Push: 'fa-mobile', Slack: 'fa-slack', Teams: 'fa-users'
};
export const MODE_LABEL: Record<NotifyMode, string> = {
    UserControlled: 'People can switch channels off', TenantControlled: 'Only admins decide', Mandatory: 'Always sent (required)'
};
export const STATUS_TONE: Record<NotifyStatus, string> = {Pending: 'info', Processing: 'info', Sent: 'success', Failed: 'danger', Cancelled: 'grey'};
export const STATUS_LABEL: Record<NotifyStatus, string> = {Pending: 'Waiting', Processing: 'Sending', Sent: 'Sent', Failed: 'Failed', Cancelled: 'Not sent (switched off)'};

export interface ChannelStatus { channel: NotifyChannel; label: string; configured: boolean; source: string; sent: number; failed: number; }
export interface NotifyOverview {
    sent: number; failed: number; pending: number; cancelled: number; successRate: number | null; channels: ChannelStatus[];
    recentFailures: NotifyLogRow[]; kindsOn: number; kindsOff: number;
}

export interface KindChannel { channel: NotifyChannel; isEnabled: boolean; hasTemplate: boolean; }
export interface NotifyKind {
    code: string; name: string; area: string; description: string; isEnabled: boolean; mode: NotifyMode; templated: boolean; onRequest: boolean;
    ruleChannels: boolean; channels: KindChannel[]; placeholders: string[]; sentLast30Days: number; failedLast30Days: number;
}
export interface NotifyKindInput { isEnabled: boolean; mode: NotifyMode; channels: NotifyChannel[]; }

export interface NotifyTemplate { code: string; channel: NotifyChannel; subject: string | null; body: string; isHtml: boolean; isCustomised: boolean; placeholders: string[]; }
export interface NotifyTemplateInput { subject: string | null; body: string; isHtml: boolean; }
export interface NotifyPreview { subject: string; body: string; isHtml: boolean; unknownPlaceholders: string[]; }

export interface DeliveryRow { channel: NotifyChannel; destination: string; status: NotifyStatus; attempts: number; error: string | null; sentAt: string | null; nextAttemptAt: string | null; }

export class NotifyLogRow extends CoreResource {
    declare code: string;
    declare kind: string;
    declare recipient: string;
    declare status: NotifyStatus;
    declare createdAt: string;
    declare completedAt: string | null;
    declare deliveries: DeliveryRow[];
}
export const NOTIFY_LOG_SERIALIZER: CoreSerializer = {
    fromJson: (json: any) => Object.assign(new NotifyLogRow(), json),
    toJson: () => { throw new Error('Grid rows are read-only.'); }
};

export class NotifyLogQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    status: 'sent' | 'failed' | 'pending' | 'cancelled' | null = null;
    code: string | null = null;
    channel: NotifyChannel | null = null;
    from: string | null = null;
    to: string | null = null;
    override toQueryString() {
        return super.getParamByObject({search: this.search, status: this.status, code: this.code, channel: this.channel, from: this.from, to: this.to});
    }
}

export interface MyPreference {
    code: string; name: string; area: string; description: string; locked: boolean; lockedReason: string | null; channels: KindChannel[];
}
