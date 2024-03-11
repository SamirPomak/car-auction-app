import {
  uploadBytesResumable,
  ref,
  Storage,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { CarInfoService } from './../../../services/car-info/car-info.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { UserService } from 'src/app/services/user.service';
import {
  Firestore,
  addDoc,
  collection,
  updateDoc,
} from '@angular/fire/firestore';

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
  transmissionOptions = [
    { label: 'Automatic', value: 'Automatic' },
    { label: 'Manual', value: 'Manual' },
    { label: 'Semi-Automatic', value: 'Semi-Automatic' },
  ];
  private imageFiles: File[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private carInfoService: CarInfoService,
    private messageService: MessageService,
    private userService: UserService,
    private storage: Storage,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    console.log(this.carInfoService.getAllBrands());
    this.brands = this.carInfoService
      .getAllBrands()
      .map((value) => ({ value, label: value }));
    console.log(this.brands);
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
    images: [[''], Validators.required],
  });

  async handleSubmit() {
    if (this.auctionForm.valid) {
      this.submitInProgress = true;
      const user = await this.userService.getUser();
      const imageUrls = [];

      for (const [index, name] of this.auctionForm.controls.images
        .getRawValue()
        .entries()) {
        const reference = ref(this.storage, `${user?.uid}/images/${name}`);
        const task = await uploadBytes(reference, this.imageFiles[index]);
        const url = await getDownloadURL(task.ref);
        imageUrls.push(url);
      }

      this.auctionForm.controls.images.setValue(imageUrls);
      const auctionData = {
        ...this.auctionForm.getRawValue(),
        author: { id: user?.uid, name: user?.displayName || 'Anonymous' },
      };

      const docRef = await addDoc(
        collection(this.firestore, 'auctions'),
        auctionData
      );
      await updateDoc(docRef, { id: docRef.id });
      this.submitInProgress = false;
      // this.loginInProgress = true;
      // this.userService
      //   .login(this.auctionForm.getRawValue())
      //   .then(() => {
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Success!',
      //       detail: 'You have been signed in successfully!',
      //     });
      //   })
      //   .catch((error) => {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: error.message,
      //     });
      //   })
      //   .finally(() => {
      //     this.loginInProgress = false;
      //   });
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
    console.log(event);
    this.auctionForm.controls.images.setValue(
      event.files.map((file) => file.name)
    );
    this.imageFiles = event.files;
  }
}
