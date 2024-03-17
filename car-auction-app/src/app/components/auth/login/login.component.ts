import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginInProgress = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}
  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async handleSubmit() {
    if (this.loginForm.valid) {
      this.loginInProgress = true;
      this.userService
        .login(this.loginForm.getRawValue())
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'You have been signed in successfully!',
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
          this.loginInProgress = false;
        });
    }
  }
}
