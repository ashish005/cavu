import {Component, Input} from "@angular/core";
import {CONDITION_OPS, ConditionOp, ConditionRule, ConditionSet, EntityField} from "../domains/process.models";

/**
 * Edits a condition in place: "all/any of: field · comparison · value". Fields are dotted paths into the event's
 * data; known fields of the record type are suggested, any other field can be typed. "is one of" takes a
 * comma-separated list. An empty condition always matches.
 */
@Component({
    selector: 'process-condition-builder',
    standalone: false,
    template: `
        <div class="text-sm">
            <div *ngIf="condition.rules.length > 1" class="mb-1">
                Match
                <select class="form-control form-control-sm d-inline-block w-auto mx-1" [(ngModel)]="condition.match">
                    <option value="all">all</option>
                    <option value="any">any</option>
                </select>
                of these
            </div>
            <div *ngFor="let rule of condition.rules; let i = index; trackBy: trackByIndex" class="d-flex flex-wrap align-items-center mb-1">
                <input class="form-control form-control-sm mr-1 mb-1" style="flex: 1 1 140px" [(ngModel)]="rule.field" [attr.list]="listId"
                       placeholder="Field, e.g. userType" maxlength="100">
                <select class="form-control form-control-sm mr-1 mb-1" style="flex: 0 1 110px" [(ngModel)]="rule.op" (ngModelChange)="opChanged(rule)">
                    <option *ngFor="let op of ops" [value]="op.value">{{ op.label }}</option>
                </select>
                <ng-container *ngIf="needsValue(rule.op)">
                    <select *ngIf="choices(rule) as values; else freeText" class="form-control form-control-sm mr-1 mb-1" style="flex: 1 1 140px"
                            [ngModel]="valueText(rule)" (ngModelChange)="setValue(rule, $event)">
                        <option *ngFor="let v of values" [value]="v">{{ v }}</option>
                    </select>
                    <ng-template #freeText>
                        <input class="form-control form-control-sm mr-1 mb-1" style="flex: 1 1 140px" [ngModel]="valueText(rule)" (ngModelChange)="setValue(rule, $event)"
                               [placeholder]="rule.op === 'in' ? 'a, b, c' : 'Value'" maxlength="500">
                    </ng-template>
                </ng-container>
                <button type="button" class="btn btn-xs white text-danger mb-1" (click)="condition.rules.splice(i, 1)" title="Remove"><i class="fa fa-times"></i></button>
            </div>
            <datalist [id]="listId"><option *ngFor="let f of fields" [value]="f.name">{{ f.label }}</option></datalist>
            <button type="button" class="btn btn-xs white" (click)="add()"><i class="fa fa-plus mr-1"></i>{{ condition.rules.length ? 'Add condition' : 'Only when…' }}</button>
            <span *ngIf="!condition.rules.length" class="text-xs text-muted ml-2">{{ emptyText }}</span>
        </div>`
})
export class ConditionBuilderComponent {
    private static next = 0;

    @Input({required: true}) condition!: ConditionSet;
    /** Known fields of the record type, suggested in the field box. */
    @Input() fields: EntityField[] = [];
    @Input() emptyText = 'Always';

    readonly ops = CONDITION_OPS;
    readonly listId = `condition-fields-${ConditionBuilderComponent.next++}`;

    add() { this.condition.rules.push({field: '', op: 'eq', value: ''}); }

    needsValue(op: ConditionOp) { return this.ops.find(o => o.value === op)?.needsValue ?? true; }

    opChanged(rule: ConditionRule) {
        if (!this.needsValue(rule.op)) { delete rule.value; }
        else { this.setValue(rule, this.valueText(rule)); }
    }

    choices(rule: ConditionRule): string[] | null {
        const field = this.fields.find(f => f.name === rule.field);
        return field?.type === 'choice' && field.values?.length && (rule.op === 'eq' || rule.op === 'neq') ? field.values : null;
    }

    valueText(rule: ConditionRule): string {
        return Array.isArray(rule.value) ? rule.value.join(', ') : (rule.value ?? '').toString();
    }

    setValue(rule: ConditionRule, text: string) {
        rule.value = rule.op === 'in' ? (text ?? '').split(',').map(v => v.trim()).filter(Boolean) : text;
    }

    trackByIndex(index: number) { return index; }
}

/** Drops incomplete rules (no field) before saving; returns null for "always". */
export const cleanCondition = (condition: ConditionSet | null | undefined): ConditionSet | null => {
    const rules = (condition?.rules ?? []).filter(r => r.field?.trim()).map(r => ({...r, field: r.field.trim()}));
    return rules.length ? {match: condition!.match, rules} : null;
};
