import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {OrgThemeSettingService} from "./services/org-theme-setting.service";
import {ThemeManagerService} from "./services/theme-manager.service";
@Component({
    selector: 'theme-setting',
    templateUrl: './templates/theme-setting.html',
    providers: [OrgThemeSettingService, ThemeManagerService],
  standalone: false
})
export class ThemeSettingComponent implements OnInit {
  customForm: FormGroup;
  id: any;
  submitted: boolean;

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(public fb: FormBuilder, public settingService: OrgThemeSettingService, public themeManager: ThemeManagerService) {
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
    // this.id = this.configurationService.uiSetting?.id;
    // this.updateData(this.configurationService.uiSetting);

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
    this.customForm.get('language').setValue(value.language);
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

    if(this.id) {
      this.settingService.update(this.id, formData.value).subscribe(success, error);
    }
    // else {
    //   this.settingService.create(formData.value).subscribe(success, error);
    // }
  }
}
