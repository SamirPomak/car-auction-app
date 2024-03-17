import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/utils/CustomValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  submitInProgress = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  registerForm = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: [CustomValidators.MatchingPasswords] }
  );

  async handleSubmit() {
    if (this.registerForm.valid) {
      this.submitInProgress = true;
      this.userService
        .register(this.registerForm.getRawValue())
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'You have been registered successfully!',
          });
          this.router.navigate(['auctions']);
        })
        .catch((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        })
        .finally(() => {
          this.submitInProgress = false;
        });
    }
  }
}
