import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notEmptyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const isValid = value.trim().length > 0;
    return isValid ? null : { 'not-empty': true };
  };
}
