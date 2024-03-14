import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, updateProfile } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { UserInfo } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  submitInProgress = false;
  user: UserInfo | null = null;

  constructor(
    private userService: UserService,
    private destroyerRef: DestroyRef,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private auth: Auth
  ) {
    this.userService
      .getUserObservable()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((data) => {
        this.user = data;

        if (data?.displayName) {
          this.profileForm.controls.displayName.setValue(data.displayName);
        }

        if (data?.photoURL) {
          this.profileForm.controls.photoURL.setValue(data.photoURL);
        }
      });
  }

  profileForm = this.formBuilder.nonNullable.group({
    displayName: [''],
    photoURL: [''],
  });

  async handleSubmit() {
    if (this.profileForm.valid && this.auth.currentUser) {
      this.submitInProgress = true;
      try {
        await updateProfile(
          this.auth.currentUser,
          this.profileForm.getRawValue()
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Your profile has been updated!',
        });
      } catch {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not update profile!',
        });
      } finally {
        this.submitInProgress = false;
      }
    }
  }
}
