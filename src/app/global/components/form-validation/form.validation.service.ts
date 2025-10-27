import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

export const defaultErrorDefinitionMap = {
  required: '{0} is required',
  countyRequired: 'County is required',
  containSpecialChars: '{0} should not contain special characters',
  containSpecialCharsExceptUnderscore: '{0} should not contain special characters except "_"',
  startWithNonAlpha: '{0} should start with an alphabet',
  startWithNonAlphaOrUnderscore: '{0} should start with an alphabet or underscore',
  duplicate: '{0} already exist',
  pattern: '{0} is not valid',
  invalid: '{0} is not valid',
  containSpace: '{0} should not contain space',
  matDatepickerMin: 'Date should be greater than {0}',
  matDatepickerMax: 'Date should be less than {0}',
  min: '{0} should be greater than {1}',
  max: '{0} should be less than {1}',
  loanGtProperty: '{0} > Property Value',
  AgeLt18: 'Age < 18 years',
  twoToFourUnit: '{0} should be 2-4',
  notExist: '{0} is not valid'
};

@Injectable()
export class FormValidationService {
  constructor() {
  }

  public getErrorMessage(control: FormControl, label: string = 'Field'): string {
    const errors = control.errors;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const message: string = defaultErrorDefinitionMap[key];
        if (key === 'matDatepickerMin') {
          return message ? this.format(message, errors[key].min.toLocaleDateString('en')) : '';
        } else if (key === 'matDatepickerMax') {
          return message ? this.format(message, errors[key].max.toLocaleDateString('en')) : '';
        } else if (key === 'min') {
          return message ? this.format(message, label, errors[key].min) : '';
        } else if (key === 'max') {
          return message ? this.format(message, label, errors[key].max) : '';
        } else {
          return message ? this.format(message, label) : '';
        }
      }
    }
    return '';
  }

  private format(template: string, ...args: any[]) {
    return template.replace(/{(\d+)}/g, (match, num) => (typeof args[num]) !== undefined ? args[num] : match);
  }
}
