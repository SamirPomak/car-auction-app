import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { ref, deleteObject, Storage } from '@angular/fire/storage';
import { Auction } from '../types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private searchQuery$ = new BehaviorSubject('');
  constructor(private firestore: Firestore, private storage: Storage) {}

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

  async deleteAuction(auction: Auction) {
    const auctionDoc = doc(this.firestore, `auctions/${auction.id}`);
    if (auction.images.length) {
      for (const { path } of auction.images) {
        const imageRef = ref(this.storage, path);
        await deleteObject(imageRef);
      }
    }

    return deleteDoc(auctionDoc);
  }
}
