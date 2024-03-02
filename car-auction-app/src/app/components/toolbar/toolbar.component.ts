import { Component, DestroyRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  private defaultMenuItems: MenuItem[] = [
    {
      label: 'Auctions',
      icon: 'pi pi-fw pi-megaphone',
    },
    {
      label: 'Sell a car',
      icon: 'pi pi-fw pi-car',
    },
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Sign In',
          icon: 'pi pi-fw pi-user',
          command: () => {
            this.router.navigate(['/login']);
          },
        },
        {
          label: 'Sign Up',
          icon: 'pi pi-fw pi-user-plus',
          command: () => {
            this.router.navigate(['/register']);
          },
        },
      ],
    },
  ];
  private loggedInUserMenuItems: MenuItem[] = [
    {
      label: 'Auctions',
      icon: 'pi pi-fw pi-megaphone',
    },
    {
      label: 'Sell a car',
      icon: 'pi pi-fw pi-car',
    },
    {
      label: 'My Profile',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-user-edit',
          command: () => {
            this.router.navigate(['/profile']);
          },
        },
        {
          label: 'Sign Out',
          icon: 'pi pi-fw pi-sign-out',
          command: () => {
            this.userService.signOut();
            this.messageService.add({
              severity: 'success',
              summary: 'Goodbye!',
              detail: 'You have been signed out!',
            });
            this.router.navigate(['/home']);
          },
        },
      ],
    },
  ];
  items = this.defaultMenuItems;
  constructor(
    private router: Router,
    private userService: UserService,
    private destroyerRef: DestroyRef,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.userService
      .getUserObservable()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        console.log(user);

        this.items = user ? this.loggedInUserMenuItems : this.defaultMenuItems;
      });
  }
}
