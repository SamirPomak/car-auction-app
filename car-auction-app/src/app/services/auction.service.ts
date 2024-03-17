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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private searchQuery$ = new BehaviorSubject('');
  constructor(private firestore: Firestore) {}

  getSearchQueryObservable() {
    return this.searchQuery$.asObservable();
  }

  updateSearch(query: string) {
    this.searchQuery$.next(query.trim().toLowerCase());
  }

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
