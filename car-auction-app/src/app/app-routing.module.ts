import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { AuctionDetailsComponent } from './components/auctions/auction-details/auction-details.component';
import { CreateAuctionComponent } from './components/auctions/create-auction/create-auction.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'auctions',
    children: [
      { path: '', pathMatch: 'full', component: AuctionsComponent },
      { path: 'details/:auctionId', component: AuctionDetailsComponent },
      {
        path: 'create',
        component: CreateAuctionComponent,
        ...canActivate(() => redirectUnauthorizedTo('/login')),
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
