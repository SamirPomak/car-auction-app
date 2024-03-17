import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuctionService } from 'src/app/services/auction.service';
import { Auction } from 'src/app/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  auctions: Auction[] = [];
  loadingAuctions = true;
  constructor(
    private destroyerRef: DestroyRef,
    private router: Router,
    private auctionService: AuctionService
  ) {
    this.auctionService
      .getAllAuctionsObserver()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(async (data) => {
        this.loadingAuctions = false;
        this.auctions = data.slice(data.length - 3) as Auction[];
      });
  }
  onAuctionClick(id: string) {
    this.router.navigate(['auctions/details', id]);
  }

  onAuctionsClick() {
    this.router.navigate(['auctions']);
  }
}
