import { FormControl } from '@angular/forms';
import { notEmptyValidator } from './not-empty.validator';

describe('notEmptyValidator', () => {
  const validator = notEmptyValidator();

  it('should return null for a non-empty string', () => {
    const control = new FormControl('Valid input');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for a string with leading/trailing spaces but non-whitespace characters', () => {
    const control = new FormControl('   Valid input   ');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error object for an empty string', () => {
    const control = new FormControl('');
    const result = validator(control);
    expect(result).toEqual({ 'not-empty': true });
  });

  it('should return an error object for a string with only whitespace', () => {
    const control = new FormControl('   ');
    const result = validator(control);
    expect(result).toEqual({ 'not-empty': true });
  });

  it('should return null for a null value', () => {
    const control = new FormControl(null);
    const result = validator(control);
    expect(result).toEqual({ 'not-empty': true });
  });

  it('should return null for an undefined value', () => {
    const control = new FormControl(undefined);
    const result = validator(control);
    expect(result).toEqual({ 'not-empty': true });
  });
});
