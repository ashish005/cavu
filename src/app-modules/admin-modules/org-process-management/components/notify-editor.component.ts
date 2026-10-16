import {Component, DestroyRef, Input, OnChanges, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, from, mergeMap, toArray} from "rxjs";
import {
    Attachment, EntityField, NOTIFY_CHANNELS, NotifyChannel, NotifyConfig, ProcessLookups, RECIPIENT_KINDS, RecipientKind, RecipientRule
} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

type TextTarget = 'subject' | 'body' | 'shortText';

/**
 * Edits a rule's notification in place: channels, subject and message with {{field}} placeholders, who receives it
 * (dynamic recipient rules, each optionally conditional) and attachments.
 */
@Component({
    selector: 'process-notify-editor',
    standalone: false,
    templateUrl: './notify-editor.component.html'
})
export class NotifyEditorComponent implements OnChanges {
    @Input({required: true}) config!: NotifyConfig;
    @Input({required: true}) lookups!: ProcessLookups;
    /** Known fields of the record type, offered as placeholders and field names. */
    @Input() fields: EntityField[] = [];
    @Input() entityType = '';

    private readonly destroyRef = inject(DestroyRef);
    readonly channels = NOTIFY_CHANNELS;
    readonly kinds = RECIPIENT_KINDS;
    readonly standardFields = ['recipientName', 'entityName', 'entityType', 'eventName', 'occurredAt'];
    readonly subjectPlaceholder = 'e.g. Invoice {{number}} needs approval';

    attachments: Attachment[] = [];
    uploading = false;
    uploadError: string | null = null;
    private target: TextTarget = 'body';
    private caret: number | null = null;

    constructor(private api: ProcessApiService) {}

    ngOnChanges() {
        this.config.recipients.forEach(r => this.prepare(r));
        this.api.attachments(this.config.attachmentIds).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: list => this.attachments = this.config.attachmentIds.map(id => list.find(a => a.id === id)).filter((a): a is Attachment => !!a),
            error: () => this.attachments = []
        });
    }

    get shortChannel() { return this.config.channels.includes('Sms') || this.config.channels.includes('Push'); }
    get usesConnection() { return this.config.channels.some(c => c === 'WhatsApp' || c === 'Slack' || c === 'Teams'); }

    hasChannel(c: NotifyChannel) { return this.config.channels.includes(c); }

    toggleChannel(c: NotifyChannel) {
        this.config.channels = this.hasChannel(c) ? this.config.channels.filter(x => x !== c) : [...this.config.channels, c];
    }

    // ----- Placeholders -----
    focus(target: TextTarget, event: Event) {
        this.target = target;
        this.caret = (event.target as HTMLInputElement | HTMLTextAreaElement).selectionStart;
    }

    insert(field: string) {
        const token = `{{${field}}}`;
        const current = (this.config[this.target] ?? '') as string;
        const at = this.caret ?? current.length;
        (this.config as any)[this.target] = current.slice(0, at) + token + current.slice(at);
        this.caret = at + token.length;
    }

    // ----- Recipients -----
    addRecipient() { this.config.recipients.push(this.prepare({kind: 'Users'})); }

    removeRecipient(i: number) { this.config.recipients.splice(i, 1); }

    kindChanged(rule: RecipientRule) { this.prepare(rule); }

    hint(kind: RecipientKind) { return this.kinds.find(k => k.value === kind)?.hint ?? ''; }

    addUser(rule: RecipientRule, userId: string) {
        if (userId && !rule.userIds!.includes(userId)) { rule.userIds!.push(userId); }
    }

    userName(id: string) { return this.lookups.users.find(u => u.id === id)?.name ?? 'Unknown'; }

    contactsText(rule: RecipientRule) { return (rule.contacts ?? []).join(', '); }

    setContacts(rule: RecipientRule, text: string) {
        rule.contacts = (text ?? '').split(/[,;\n]/).map(x => x.trim()).filter(Boolean);
    }

    toggleCondition(rule: RecipientRule) {
        rule.condition = rule.condition ? null : {match: 'all', rules: [{field: '', op: 'eq', value: ''}]};
    }

    private prepare(rule: RecipientRule): RecipientRule {
        rule.userIds ??= [];
        rule.contacts ??= [];
        return rule;
    }

    // ----- Attachments -----
    upload(input: HTMLInputElement) {
        const files = Array.from(input.files ?? []);
        input.value = '';
        if (!files.length) { return; }
        if (this.config.attachmentIds.length + files.length > 5) { this.uploadError = 'Attach 5 files at most.'; return; }
        const tooBig = files.find(f => f.size > 10 * 1024 * 1024);
        if (tooBig) { this.uploadError = `${tooBig.name} is larger than 10 MB.`; return; }

        this.uploading = true;
        this.uploadError = null;
        from(files).pipe(
            mergeMap(f => this.api.uploadAttachment(f), 2),
            toArray(),
            finalize(() => this.uploading = false),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: added => {
                this.attachments.push(...added);
                this.config.attachmentIds.push(...added.map(a => a.id));
            },
            error: e => this.uploadError = errorMessageOf(e, 'The file could not be uploaded.')
        });
    }

    removeAttachment(a: Attachment) {
        this.attachments = this.attachments.filter(x => x.id !== a.id);
        this.config.attachmentIds = this.config.attachmentIds.filter(id => id !== a.id);
    }

    download(a: Attachment) { this.api.downloadAttachment(a).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(); }

    size(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

    trackByIndex(index: number) { return index; }
}
