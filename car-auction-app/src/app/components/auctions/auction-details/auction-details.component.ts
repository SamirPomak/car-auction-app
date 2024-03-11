import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { UserInfo } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { Inplace } from 'primeng/inplace';
import { UserService } from 'src/app/services/user.service';
import { Auction, Bid } from 'src/app/types';

const auctionInfoTableKeysSortOrder: Record<string, number> = {
  make: 1,
  model: 2,
  year: 3,
  engine: 4,
  mileage: 5,
  transmission: 6,
  color: 7,
  selller: 8,
};

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss'],
})
export class AuctionDetailsComponent {
  auction: Auction | undefined;
  user: UserInfo | null = null;
  auctionTableData: Record<string, string | number>[] = [];
  bidPrice = 0;
  fullscreen = false;
  @ViewChild('inplace') inplaceInput!: Inplace;
  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private destroyerRef: DestroyRef,
    private userService: UserService,
    private messageService: MessageService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    const auctionDoc = doc(this.firestore, `auctions/${id}`);
    docData(auctionDoc)
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((data) => {
        if (data) {
          this.auction = data as Auction;
          const { id, bids, images, price, author, ...tableData } = data;
          tableData['seller'] = author.name;
          this.auctionTableData = Object.keys(tableData)
            .sort(
              (a: string, b: string) =>
                auctionInfoTableKeysSortOrder[a] -
                auctionInfoTableKeysSortOrder[b]
            )
            .map((key) => ({
              title: key,
              value: tableData[key],
            }));

          console.log(this.auctionTableData);
          console.log(data);
        }
      });

    this.userService
      .getUserObservable()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        this.user = user;
      });
  }

  toggleFullscreen(show: boolean) {
    this.fullscreen = show;
  }

  onActivateBidMenu() {
    this.bidPrice = this.auction?.price || 0;
  }

  placeBid() {
    if (!this.user || !this.auction) return;

    const id = this.route.snapshot.paramMap.get('id')!;
    const auctionDoc = doc(this.firestore, `auctions/${id}`);
    const currentBids = this.auction?.bids || [];
    const newBid: Bid = {
      bid: this.bidPrice,
      buyer: {
        name: this.user.displayName,
        id: this.user.uid,
        avatar: this.user.photoURL,
      },
    };
    const dataForUpdate: Partial<Auction> = { bids: [...currentBids, newBid] };
    if (this.bidPrice > this.auction.price) {
      dataForUpdate.price = this.bidPrice;
    }

    updateDoc(auctionDoc, dataForUpdate);
    this.inplaceInput.deactivate();
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Your bid has been placed!',
      life: 4000,
    });
  }
}
