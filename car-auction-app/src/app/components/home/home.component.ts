import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
    private firestore: Firestore,
    private destroyerRef: DestroyRef,
    private router: Router
  ) {
    const auctionCollection = collection(this.firestore, 'auctions');
    collectionData(auctionCollection)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(async (data) => {
        this.loadingAuctions = false;
        this.auctions = data.slice(data.length - 4) as Auction[];
        console.log(data);
      });
  }
  onAuctionClick(id: string) {
    this.router.navigate(['auctions/details', id]);
  }

  onAuctionsClick() {
    this.router.navigate(['auctions']);
  }
}
