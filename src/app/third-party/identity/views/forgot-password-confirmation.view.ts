import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    templateUrl: './templates/forgot-password-confirmation.html'
})
export class ForgotPasswordConfirmationView {
    constructor(public fb: FormBuilder) {}
}
