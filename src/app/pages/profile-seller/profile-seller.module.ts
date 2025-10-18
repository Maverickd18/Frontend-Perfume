import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSellerPageRoutingModule } from './profile-seller-routing.module';

import { ProfileSellerPage } from './profile-seller.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileSellerPageRoutingModule
  ],
  declarations: [ProfileSellerPage]
})
export class ProfileSellerPageModule {}
