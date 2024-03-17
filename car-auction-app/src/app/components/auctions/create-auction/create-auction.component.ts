import {
  ref,
  Storage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { CarInfoService } from './../../../services/car-info/car-info.service';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from 'src/app/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserInfo } from 'firebase/auth';
import { AuctionService } from 'src/app/services/auction.service';

type DropdownOption = { value: string; label: string };

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent implements OnInit {
  submitInProgress = false;
  brands: DropdownOption[] = [];
  models: DropdownOption[] = [];
  mode: 'edit' | 'default' = 'default';
  auction: Auction | undefined;
  transmissionOptions = [
    { label: 'Automatic', value: 'Automatic' },
    { label: 'Manual', value: 'Manual' },
    { label: 'Semi-Automatic', value: 'Semi-Automatic' },
  ];
  private user: UserInfo | null = null;
  private imageFiles: Record<string, File> = {};
  private deletedImages: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carInfoService: CarInfoService,
    private messageService: MessageService,
    private userService: UserService,
    private storage: Storage,
    private route: ActivatedRoute,
    private destroyerRef: DestroyRef,
    private router: Router,
    private auctionService: AuctionService
  ) {
    userService
      .getUserObservable()
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe((user) => {
        this.user = user;
      });
  }

  ngOnInit() {
    this.brands = this.carInfoService
      .getAllBrands()
      .map((value) => ({ value, label: value }));

    this.route.data
      .pipe(takeUntilDestroyed(this.destroyerRef))
      .subscribe(({ auction }) => {
        if (auction) {
          this.mode = 'edit';
          this.auction = auction;
          const { author, bids, id, ...data } = auction;
          this.models = this.carInfoService
            .getModelsForBrand(auction.make)
            .map((value) => ({ value, label: value }));
          this.auctionForm.setValue(data);
        }
      });
  }
  auctionForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required]],
    model: ['', [Validators.required]],
    year: [2024, [Validators.required]],
    engine: ['', [Validators.required]],
    mileage: [0, [Validators.required]],
    transmission: ['', [Validators.required]],
    color: ['', [Validators.required]],
    price: [0, [Validators.required]],
    images: [[{ path: '', url: '' }], Validators.required],
  });

  async handleSubmit() {
    if (this.auctionForm.valid && this.user?.uid) {
      this.submitInProgress = true;
      let auctionId = '';
      try {
        if (this.mode === 'default') {
          const imageUrls = [];

          for (const {
            path,
          } of this.auctionForm.controls.images.getRawValue()) {
            const reference = ref(this.storage, path);
            const task = await uploadBytes(reference, this.imageFiles[path]);
            const url = await getDownloadURL(task.ref);
            imageUrls.push({ url, path });
          }

          this.auctionForm.controls.images.setValue(imageUrls);
          const auctionData = {
            ...this.auctionForm.getRawValue(),
            author: {
              id: this.user.uid,
              name: this.user?.displayName || 'Anonymous',
            },
          };

          const docRef = await this.auctionService.uploadAuction(auctionData);
          await this.auctionService.updateAuction(docRef.id, { id: docRef.id });
          auctionId = docRef.id;
        } else {
          const updatedImages = this.auctionForm.controls.images.getRawValue();

          for (const path of this.deletedImages) {
            const imageRef = ref(this.storage, path);
            await deleteObject(imageRef);
          }

          for (const [index, image] of updatedImages.entries()) {
            if (!image.url) {
              const reference = ref(this.storage, image.path);
              const task = await uploadBytes(
                reference,
                this.imageFiles[image.path]
              );
              const url = await getDownloadURL(task.ref);
              updatedImages[index].url = url;
            }
          }

          this.auctionForm.controls.images.setValue(updatedImages);
          this.auction?.id &&
            (await this.auctionService.updateAuction(
              this.auction.id,
              this.auctionForm.getRawValue()
            ));

          if (this.auction?.id) {
            auctionId = this.auction.id;
          }
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail:
            this.mode === 'default'
              ? 'Your auction has started!'
              : 'Your auction has been updated!',
        });
        this.router.navigate(['auctions/details', auctionId]);
      } catch {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            this.mode === 'default'
              ? 'Could not upload auction!'
              : 'Could not update auction!',
        });
      } finally {
        this.submitInProgress = false;
      }
    }
  }

  handleOnBrandChange(event: DropdownChangeEvent) {
    if (event.value) {
      this.models = this.carInfoService
        .getModelsForBrand(event.value)
        .map((value) => ({ value, label: value }));
    }
  }

  onUpload(event: FileUploadHandlerEvent) {
    if (!this.user) return;

    if (this.mode === 'default') {
      this.auctionForm.controls.images.setValue(
        event.files.map((file) => ({
          path: `${this.user?.uid}/images/${file.name}`,
          url: '',
        }))
      );
    } else {
      const updatedImages = this.auctionForm.controls.images.getRawValue();
      event.files.forEach((file) =>
        updatedImages.push({
          path: `${this.user?.uid}/images/${file.name}`,
          url: '',
        })
      );
      this.auctionForm.controls.images.setValue(updatedImages);
    }

    event.files.forEach((file) => {
      this.imageFiles[`${this.user?.uid}/images/${file.name}`] = file;
    });
  }

  onDeleteImage(imagePath: string) {
    this.deletedImages.push(imagePath);
    const currentImages = this.auctionForm.controls.images.getRawValue();

    this.auctionForm.controls.images.setValue(
      currentImages.filter((image) => image.path !== imagePath)
    );
  }
}
