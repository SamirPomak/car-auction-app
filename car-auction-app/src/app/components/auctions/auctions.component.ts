import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, debounceTime } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
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
    private destroyerRef: DestroyRef,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private auctionService: AuctionService
  ) {
    const routeMode = route.snapshot.data['mode'];
    if (routeMode) {
      this.mode = routeMode;
    }

    combineLatest([
      this.auctionService.getSearchQueryObservable().pipe(debounceTime(500)),
      this.auctionService.getAllAuctionsObserver(),
    ])
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(async ([query, data]) => {
        this.loadingAuctions = false;
        if (this.mode === 'myAuctions') {
          const userId = (await userService.getUser())?.uid;
          this.auctions = (data as Auction[]).filter(
            (auction) => auction.author.id === userId
          );
        } else {
          this.auctions = data as Auction[];
          this.auctions = this.auctions.filter((auction) =>
            `${auction.year} ${auction.make} ${auction.model}`
              .toLowerCase()
              .includes(query)
          );
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
