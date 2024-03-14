import { Component, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { getDownloadURL } from '@angular/fire/storage';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Auction } from 'src/app/types';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss'],
})
export class AuctionsComponent {
  mode: 'myAuctions' | undefined;
  loadingAuctions = true;
  auctions: Auction[] = [];
  constructor(
    private firestore: Firestore,
    private destroyerRef: DestroyRef,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    const routeMode = route.snapshot.data['mode'];
    if (routeMode) {
      this.mode = routeMode;
    }

    const auctionCollection = collection(this.firestore, 'auctions');
    collectionData(auctionCollection)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(async (data) => {
        this.loadingAuctions = false;
        if (this.mode === 'myAuctions') {
          const userId = (await userService.getUser())?.uid;
          this.auctions = (data as Auction[]).filter(
            (auction) => auction.author.id === userId
          );
        } else {
          this.auctions = data as Auction[];
        }
        console.log(data);
      });
  }

  onAuctionClick(id: string) {
    this.router.navigate(['auctions/details', id]);
  }

  onAuctionEditClick(id: string) {
    this.router.navigate(['auctions/edit', id]);
  }
}
