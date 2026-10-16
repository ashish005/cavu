import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {OrgThemeSettingService} from "./services/org-theme-setting.service";
import {ThemeManagerService} from "./services/theme-manager.service";
import {AlertService, MessageSeverity} from "../alert";
@Component({
    selector: 'theme-setting',
    templateUrl: './templates/theme-setting.html',
    providers: [OrgThemeSettingService],
  standalone: false
})
export class ThemeSettingComponent implements OnInit {
  customForm: FormGroup;
  id: any;
  submitted: boolean;

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(public fb: FormBuilder, public settingService: OrgThemeSettingService,
              public themeManager: ThemeManagerService, private alertService: AlertService) {
      this.customForm = this.fb.group({
          id: [null],
          isFixedAside: [true],
          isFixedContent: [true],
          isFoldedAside: [false],
          isBoxedLayout: [false],
          isFullscreen: [false],
          name: [1],
          code: ["light"],
          fontId: ['verd'],
          language: ['en']
      });
  }

  ngOnInit(){
      // Start from the organisation's saved theme.
      this.settingService.read().subscribe({ next: theme => this.updateData(theme), error: () => {} });

      this.customForm.valueChanges.subscribe(r=> {
          this.themeManager.applySetting(r);
          //this.configurationService.themeId = r.name;
      });
  }

  updateData(dataValue: any) {
    let value = dataValue || this.themeManager.defaultTheme;
    this.customForm.get('isFixedAside').setValue(value.isFixedAside);
    this.customForm.get('isFixedContent').setValue(value.isFixedContent);
    this.customForm.get('isFoldedAside').setValue(value.isFoldedAside);
    this.customForm.get('isBoxedLayout').setValue(value.isBoxedLayout);
    this.customForm.get('isFullscreen').setValue(value.isFullscreen);
    this.customForm.get('language').setValue(value.language || 'en');
    this.customForm.get('code').setValue(value.code || null);
    this.customForm.get('name').setValue(value.name || '1');
    this.customForm.get('fontId').setValue(value.fontId || 'verd');
  };

  get formBaseThemeId() { return <FormGroup>this.customForm.get('code'); }
  get formThemeId() { return <FormGroup>this.customForm.get('name'); }
  get formFontId() { return <FormGroup>this.customForm.get('fontId'); }
  get formLanguageId() { return <FormGroup>this.customForm.get('language'); }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  onSubmit(formData) {
    if (this.customForm.invalid) {
      return;
    }

    this.submitted = true;

    const success = (resp: any) => {
      this.submitted = false;
    };

    const error = (resp: any) => {
      this.submitted = false;
    };

    this.settingService.save(formData.value).subscribe({
      next: (theme) => {
        success(theme);
        this.alertService.showMessage('Saved', 'This is now the theme for everyone in your organisation.', MessageSeverity.success);
        this.onOk.emit(theme);
      },
      error: (e) => {
        error(e);
        // Members without the permission still see their choice for this session.
        const message = e?.status === 403 ? 'Only administrators can change the organisation\'s theme. Your choice applies until you reload.'
          : (e?.error?.message || 'The theme could not be saved.');
        this.alertService.showMessage('Not saved', message, MessageSeverity.warn);
      }
    });
  }
}
