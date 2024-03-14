import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { Auction } from 'src/app/types';

export const auctionResolver: ResolveFn<Promise<Auction>> = (route) => {
  const firestore = inject(Firestore);
  const id = route.paramMap.get('id')!;
  const auctionDoc = doc(firestore, `auctions/${id}`);
  return firstValueFrom(docData(auctionDoc)) as Promise<Auction>;
};
