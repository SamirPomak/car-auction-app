import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { AuctionDetailsComponent } from './components/auctions/auction-details/auction-details.component';
import { CreateAuctionComponent } from './components/auctions/create-auction/create-auction.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { auctionResolver } from './components/auctions/auction.resolver';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
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
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
