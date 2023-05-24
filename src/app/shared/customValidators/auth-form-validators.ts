import { FormControl } from "@angular/forms";

export function getPasswordMinLengthValidator(minLength: number): (control: FormControl) => { [k:string] : boolean } {

  return (control: FormControl) => control.value && control.value.length < minLength ? { 'passwordIsTooShort': true } : null;
}
