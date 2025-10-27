import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    Input, OnDestroy, OnInit, TemplateRef, ViewChild,
} from '@angular/core';
import {FormControlName} from '@angular/forms';
import {FormValidationService} from "./form.validation.service";
import {Observable, Subject, Subscription} from "rxjs";

function toScreamingSnakeCase(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

@Component({
  selector: 'div.md-form-group',
  template: `<ng-content></ng-content><small class="parsley-required" style="color:#f95b5b;position: absolute;display: flex;">{{errorMsg}}</small>`,
  providers: [FormValidationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupWithErrorComponent implements OnInit, AfterViewInit {
  @ContentChild('label', { static: true }) label: TemplateRef<any>;
  @ContentChild(FormControlName, { static: true }) formControlName: any;
  public errorMsg: string;
  labelTag: any;

  constructor(private elRef: ElementRef,
              private validationService: FormValidationService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(){}

  ngAfterViewInit() {
    if(this.formControlName && this.formControlName.invalid){
      this.labelTag = this.elRef.nativeElement.querySelector('label');
      setTimeout(r => { this.setLabel(); }, 100);
      this.formControlName.statusChanges.subscribe(change => { this.setLabel(); });
    }
  }

  public setLabel() {
    const label = this.label || (this.labelTag && this.labelTag.textContent && this.labelTag.textContent.trim());
    this.errorMsg = this.validationService.getErrorMessage(this.formControlName, label) || '';
    this.cdr.markForCheck();
  }
}
