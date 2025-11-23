import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ProfileSellerPage } from './profile-seller.page';
import { ProfileSellerRoutingModule } from './profile-seller-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileSellerRoutingModule
  ],
  declarations: [ProfileSellerPage],
  schemas: []
})
export class ProfileSellerPageModule {}
