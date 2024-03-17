import { Component, DestroyRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';
import { AuctionService } from 'src/app/services/auction.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  darkMode = false;
  private THEME_PREF_KEY = 'car-auction-theme-pref';
  private defaultMenuItems: MenuItem[] = [
    {
      label: 'Auctions',
      icon: 'pi pi-fw pi-megaphone',
      command: () => {
        this.router.navigate(['/auctions']);
      },
    },
    {
      label: 'Sell a car',
      icon: 'pi pi-fw pi-car',
      command: () => {
        this.router.navigate(['/auctions/create']);
      },
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
      command: () => {
        this.router.navigate(['/auctions']);
      },
    },
    {
      label: 'My Auctions',
      icon: 'pi pi-fw pi-file-edit',
      command: () => {
        this.router.navigate(['/auctions/my']);
      },
    },
    {
      label: 'Sell a car',
      icon: 'pi pi-fw pi-car',
      command: () => {
        this.router.navigate(['/auctions/create']);
      },
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
  searchQuery = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private destroyerRef: DestroyRef,
    private messageService: MessageService,
    private auctionService: AuctionService,
    private themeService: ThemeService
  ) {}
  ngOnInit() {
    this.userService
      .getUserObservable()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        this.items = user ? this.loggedInUserMenuItems : this.defaultMenuItems;
      });

    const theme = localStorage.getItem(this.THEME_PREF_KEY);
    if (theme === 'dark') {
      this.darkMode = true;
      this.themeService.switchTheme('dark');
    }
  }

  onSearch() {
    this.auctionService.updateSearch(this.searchQuery);
    if (this.router.url !== '/auctions') {
      this.router.navigate(['auctions']);
    }
  }

  onClearSearch() {
    this.searchQuery = '';
    this.auctionService.updateSearch('');
  }

  onThemeChange(event: ToggleButtonChangeEvent) {
    this.darkMode = !!event.checked;

    if (this.darkMode) {
      this.themeService.switchTheme('dark');
    } else {
      this.themeService.switchTheme('light');
    }

    localStorage.setItem(this.THEME_PREF_KEY, this.darkMode ? 'dark' : 'light');
  }
}
