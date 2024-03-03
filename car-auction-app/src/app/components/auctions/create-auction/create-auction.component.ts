import { CarInfoService } from './../../../services/car-info/car-info.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';

type DropdownOption = { value: string; label: string };

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent implements OnInit {
  loginInProgress = false;
  brands: DropdownOption[] = [];
  models: DropdownOption[] = [];
  transmissionOptions = [
    { label: 'Automatic', value: 'Automatic' },
    { label: 'Manual', value: 'Manual' },
    { label: 'Semi-Automatic', value: 'Semi-Automatic' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private carInfoService: CarInfoService,
    private messageService: MessageService
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
  });

  async handleSubmit() {
    if (this.auctionForm.valid) {
      console.log(this.auctionForm.getRawValue());
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
}
