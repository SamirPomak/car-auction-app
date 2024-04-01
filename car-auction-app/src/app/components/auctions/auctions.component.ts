import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { combineLatest, debounceTime, firstValueFrom } from 'rxjs';
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
  sortOrder: number | undefined;
  sortField: string | undefined;
  sortOptions: SelectItem[] = [
    { label: 'Unsorted', value: 'price' },
    { label: 'Price High to Low', value: 'price_high' },
    { label: 'Price Low to High', value: 'price_low' },
  ];
  constructor(
    private destroyerRef: DestroyRef,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private auctionService: AuctionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
      });
  }

  onAuctionClick(id: string) {
    this.router.navigate(['auctions/details', id]);
  }

  onAuctionEditClick(id: string) {
    this.router.navigate(['auctions/edit', id]);
  }

  onAuctionDeleteClick(event: Event, auction: Auction) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this auction?',
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      accept: () => {
        this.auctionService
          .deleteAuction(auction)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Your auction has been deleted!',
              life: 4000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Could not delete your auction!',
              life: 4000,
            });
          });
      },
    });
  }

  async onSortChange(event: any) {
    let value = event.value;

    switch (value) {
      case 'price_high':
        this.sortOrder = -1;
        this.sortField = value.split('_')[0];
        break;
      case 'price_low':
        this.sortOrder = 1;
        this.sortField = value.split('_')[0];
        break;
      default:
        this.sortOrder = undefined;
        this.sortField = undefined;
        this.auctions = (await firstValueFrom(
          this.auctionService.getAllAuctionsObserver()
        )) as Auction[];
    }
  }
}
