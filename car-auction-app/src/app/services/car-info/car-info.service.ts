import { Injectable } from '@angular/core';
import { brandsAndModels } from './brandsAndModels';

@Injectable({
  providedIn: 'root',
})
export class CarInfoService {
  getAllBrands() {
    return Object.keys(brandsAndModels);
  }

  getModelsForBrand(brand: keyof typeof brandsAndModels) {
    return brandsAndModels[brand];
  }
}
