import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { AuctionDetailsComponent } from './components/auctions/auction-details/auction-details.component';
import { CreateAuctionComponent } from './components/auctions/create-auction/create-auction.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { auctionResolver } from './components/auctions/auction.resolver';
import { ProfileComponent } from './components/auth/profile/profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo('/home')),
  },
  {
    path: 'register',
    component: RegisterComponent,
    ...canActivate(() => redirectLoggedInTo('/home')),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(() => redirectUnauthorizedTo('/login')),
  },
  {
    path: 'auctions',
    children: [
      { path: '', pathMatch: 'full', component: AuctionsComponent },
      {
        path: 'my',
        component: AuctionsComponent,
        data: { mode: 'myAuctions' },
      },
      { path: 'details/:id', component: AuctionDetailsComponent },
      {
        path: 'create',
        component: CreateAuctionComponent,
        ...canActivate(() => redirectUnauthorizedTo('/login')),
      },
      {
        path: 'edit/:id',
        component: CreateAuctionComponent,
        ...canActivate(() => redirectUnauthorizedTo('/login')),
        resolve: {
          auction: auctionResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
