import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { Auction } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  constructor(private firestore: Firestore) {}

  getAuctionObserver(id: string) {
    const auctionDoc = doc(this.firestore, `auctions/${id}`);
    return docData(auctionDoc);
  }

  getAllAuctionsObserver() {
    const auctionCollection = collection(this.firestore, 'auctions');
    return collectionData(auctionCollection);
  }
  uploadAuction(auction: Partial<Auction>) {
    return addDoc(collection(this.firestore, 'auctions'), auction);
  }

  updateAuction(id: string, data: Partial<Auction>) {
    const auctionDoc = doc(this.firestore, `auctions/${id}`);
    return updateDoc(auctionDoc, data);
  }
}
