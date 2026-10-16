import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {APPEARANCE_STYLES, DynamicComponent} from "@app-global";
import {OrgAdminGridEvents} from "../services/org-admin-api.service";

// Cell renderers of the organisation administration grids (org-grid `cellTemplate`). Buttons report through
// OrgAdminGridEvents; the view listening on it does the work.

/** Role name with built-in / off badges and its description. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="context.isSystemRole" class="badge grey ml-1" title="Provided with the organisation">built-in</span>
        <span *ngIf="!context.isActive" class="badge warn ml-1">off</span>
        <div *ngIf="context.description" class="text-xs text-muted text-truncate" style="max-width: 360px">{{ context.description }}</div>`
})
export class RoleNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Member name, email and active state. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="_600">{{ context.name }} <span *ngIf="!context.isActive" class="badge grey ml-1">inactive</span></div>
        <div class="text-xs text-muted">{{ context.email }}</div>`
})
export class MemberNameCell extends DynamicComponent {}

/** A member's roles as chips, with a button to change them. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span *ngFor="let r of context.roles" class="badge mr-1 mb-1" [ngClass]="r.code === 'super_admin' || r.code === 'admin' ? 'theme' : 'info'">{{ r.name }}</span>
        <span *ngIf="!context.roles?.length" class="text-muted text-xs">No role</span>
        <button type="button" class="btn btn-xs white ml-1" (click)="events.emit('roles', context)" title="Change roles"><i class="fa fa-pencil"></i></button>`
})
export class MemberRolesCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Connection name, provider and default / off state. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="context.isDefault" class="badge theme ml-1" title="Used for this kind of message">default</span>
        <span *ngIf="!context.isEnabled" class="badge grey ml-1">off</span>
        <div class="text-xs text-muted">{{ context.providerName }}<ng-container *ngIf="context.eventCount"> · {{ context.eventCount }} event pattern(s)</ng-container></div>`
})
export class IntegrationNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Connection health from its last use or test. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="context.health === 'Healthy' ? 'success' : context.health === 'Failing' ? 'danger' : 'grey'">
            {{ context.health === 'Healthy' ? 'Working' : context.health === 'Failing' ? 'Failing' : 'Not tested' }}
        </span>
        <div *ngIf="context.lastError" class="text-xs text-danger text-truncate" style="max-width: 260px" [title]="context.lastError">{{ context.lastError }}</div>`
})
export class IntegrationHealthCell extends DynamicComponent {}

/** Test / make default / view activity buttons of a connection. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="text-nowrap">
            <button type="button" class="btn btn-xs white mr-1" (click)="events.emit('test', context)" title="Check the connection"><i class="fa fa-plug mr-1"></i>Test</button>
            <button *ngIf="!context.isDefault && context.isEnabled && context.category !== 'Webhook'" type="button" class="btn btn-xs white mr-1"
                    (click)="events.emit('default', context)">Make default</button>
            <button type="button" class="btn btn-xs white" (click)="events.emit('activity', context)" title="What it sent and received"><i class="fa fa-history"></i></button>
        </div>`
})
export class IntegrationActionsCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Activity status, attempts and next retry. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="context.status === 'Succeeded' ? 'success' : context.status === 'Failed' ? 'danger' : 'warn'">{{ context.status }}</span>
        <span *ngIf="context.responseCode" class="text-xs text-muted ml-1">HTTP {{ context.responseCode }}</span>
        <span *ngIf="context.attempts > 1" class="text-xs text-muted ml-1">×{{ context.attempts }}</span>
        <div *ngIf="context.status === 'Pending' && context.nextAttemptAt" class="text-xs text-muted">next try {{ context.nextAttemptAt | date:'short' }}</div>
        <div *ngIf="context.error" class="text-xs text-danger text-truncate" style="max-width: 280px" [title]="context.error">{{ context.error }}</div>`
})
export class IntegrationLogStatusCell extends DynamicComponent {}

/** Details / send again buttons of an activity row. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="text-nowrap">
            <button type="button" class="btn btn-xs white mr-1" (click)="events.emit('open', context)">Details</button>
            <button *ngIf="context.kind === 'Outbound' && context.status === 'Failed'" type="button" class="btn btn-xs white"
                    (click)="events.emit('redeliver', context)" title="Queue this delivery again">Send again</button>
        </div>`
})
export class IntegrationLogActionsCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Branch name with head / closed badges and address. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="context.isHeadBranch" class="badge theme ml-1">head</span>
        <span *ngIf="!context.isActive" class="badge grey ml-1">closed</span>
        <div *ngIf="context.address" class="text-xs text-muted text-truncate" style="max-width: 320px">{{ context.address }}</div>`
})
export class BranchNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Branch setup state, with retry when it failed. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="context.seedStatus === 'Completed' ? 'success' : context.seedStatus === 'Failed' ? 'danger' : 'warn'">
            {{ context.seedStatus === 'Completed' ? 'Ready' : context.seedStatus === 'Failed' ? 'Setup failed' : 'Setting up…' }}
        </span>
        <button *ngIf="context.seedStatus === 'Failed' || context.seedStatus === 'Completed'" type="button" class="btn btn-xs white ml-1"
                (click)="events.emit('reseed', context)" [title]="context.seedStatus === 'Failed' ? 'Try the setup again' : 'Run the setup again (adds anything missing)'">
            <i class="fa fa-refresh"></i></button>
        <div *ngIf="context.seedLastError" class="text-xs text-danger text-truncate" style="max-width: 240px" [title]="context.seedLastError">{{ context.seedLastError }}</div>`
})
export class BranchSeedCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Host name with on/off and maintenance badges. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.hostName }}</a>
        <span *ngIf="!context.enable" class="badge grey ml-1">off</span>
        <span *ngIf="context.isUnderConstruction" class="badge warn ml-1" title="Visitors see a maintenance page">maintenance</span>`
})
export class HostNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Member type name and code. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <div class="text-xs text-muted">{{ context.code }}<ng-container *ngIf="context.registrationNoFormat"> · numbers {{ context.registrationNoFormat }}</ng-container></div>`
})
export class MemberTypeNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Requirement name with built-in / off badges and description. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="context.isSystem" class="badge grey ml-1">built-in</span>
        <span *ngIf="!context.isActive" class="badge warn ml-1">off</span>
        <div *ngIf="context.description" class="text-xs text-muted text-truncate" style="max-width: 360px">{{ context.description }}</div>
        <div *ngIf="context.kind === 'Document'" class="text-xs text-muted">{{ context.allowedExtensions }} · up to {{ context.maxSizeMb }} MB</div>`
})
export class RequirementNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Which member types must provide it, and whether it is verified. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span *ngFor="let r of context.rules" class="badge mr-1 mb-1" [ngClass]="r.isMandatory ? 'info' : 'grey'">
            {{ r.userTypeName }}{{ r.isMandatory ? ' · required' : ' · optional' }}{{ r.verificationRequired ? ' · verified' : '' }}
        </span>
        <span *ngIf="!context.rules?.length" class="text-xs text-muted">Not asked for</span>`
})
export class RequirementRulesCell extends DynamicComponent {}

/** Portlet name with off / not-in-plan badges and description. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="!context.isEnabled" class="badge grey ml-1">off</span>
        <span *ngIf="!context.moduleInPlan" class="badge warn ml-1" title="Your plan does not include this module">not in plan</span>
        <div class="text-xs text-muted text-truncate" style="max-width: 380px" [title]="context.description">{{ context.description }}</div>`
})
export class PortletNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Who sees it: permission needed and how many eligible roles see it. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="text-sm">{{ context.visibleRoles }} of {{ context.eligibleRoles }} role(s)</div>
        <div class="text-xs text-muted">{{ context.permissionName ? 'needs "' + context.permissionName + '"' : 'own data, no permission needed' }}</div>`
})
export class PortletAudienceCell extends DynamicComponent {}

/** Ticket subject with number, type, area and reporter. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.subject }}</a>
        <span *ngIf="context.fingerprint" class="badge grey ml-1" role="button" title="Show reports of the same failure" (click)="events.emit('similar', context)"><i class="fa fa-clone"></i></span>
        <div class="text-xs text-muted">{{ context.number }} · {{ context.type }}{{ context.module ? ' · ' + context.module : '' }} · {{ context.reporterName }}</div>`
})
export class TicketSubjectCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Severity and status badges, with the response target. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge mr-1" [ngClass]="severityTone[context.severity]">{{ context.severity }}</span>
        <span class="badge" [ngClass]="statusTone[context.status]">{{ statusLabel[context.status] }}</span>
        <div class="text-xs" [class.text-danger]="context.isOverdue" [class.text-muted]="!context.isOverdue">
            {{ context.isOverdue ? 'reply overdue since' : 'reply by' }} {{ context.dueAt | date:'MMM d, h:mm a' }}</div>`
})
export class TicketStatusCell extends DynamicComponent {
    readonly severityTone: Record<string, string> = {Low: 'grey', Normal: 'info', High: 'warn', Critical: 'danger'};
    readonly statusTone: Record<string, string> = {Open: 'info', InProgress: 'primary', WaitingOnReporter: 'warn', Resolved: 'success', Closed: 'grey'};
    readonly statusLabel: Record<string, string> = {Open: 'Open', InProgress: 'In progress', WaitingOnReporter: 'Waiting on reporter', Resolved: 'Resolved', Closed: 'Closed'};
}

/** Feedback rating, kind and message. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="text-warning" (click)="events.emit('open', context)" style="letter-spacing: 1px">{{ context.stars }}</a>
        <span class="badge grey ml-1">{{ context.kind }}</span>
        <div class="text-sm text-truncate" style="max-width: 420px" [title]="context.message || ''">{{ context.message || '(no comment)' }}</div>`
})
export class FeedbackMessageCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** Appearance row: who it is for, and whether it is its own or inherited. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="!context.isDefault && !context.isCustom" class="badge grey ml-1" title="Uses the organisation default">inherits</span>
        <span *ngIf="!context.allowPersonal" class="badge warn ml-1" title="Members cannot choose their own">locked</span>
        <div class="text-xs text-muted">{{ context.members }} member(s){{ context.personalChoices ? ' · ' + context.personalChoices + ' with their own choice' : '' }}</div>`
})
export class AppearanceNameCell extends DynamicComponent {
    constructor(public events: OrgAdminGridEvents) { super(); }
}

/** A small swatch and summary of an appearance. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="d-flex align-items-center">
            <span class="mr-2" style="width: 22px; height: 22px; border-radius: 50%; display: inline-block; box-shadow: inset 0 0 0 2px rgba(255,255,255,.3)"
                  [style.background]="swatch"></span>
            <span class="text-sm">{{ styleName }} · {{ mode }}</span>
        </div>
        <div class="text-xs text-muted">{{ context.theme?.cardHeaders === 'coloured' ? 'Coloured' : 'Plain' }} headers · {{ context.theme?.font }} · {{ size }} text</div>`
})
export class AppearanceSummaryCell extends DynamicComponent {
    get style() { return APPEARANCE_STYLES.find(s => s.code === this.context?.theme?.style) ?? APPEARANCE_STYLES[0]; }
    get swatch() { return `linear-gradient(135deg, ${this.style.swatch} 60%, ${this.style.accent} 60%)`; }
    get styleName() { return this.style.name; }
    get mode() { return ({light: 'Light', dark: 'Dark', auto: 'Auto'} as Record<string, string>)[this.context?.theme?.mode] ?? 'Light'; }
    get size() { return ({sm: 'small', md: 'normal', lg: 'large'} as Record<string, string>)[this.context?.theme?.fontScale] ?? 'normal'; }
}
