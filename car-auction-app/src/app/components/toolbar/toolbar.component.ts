import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
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
          },
          {
            label: 'Sign Up',
            icon: 'pi pi-fw pi-user-plus',
          },
        ],
      },
    ];
  }
}
