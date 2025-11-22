import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SellerProfilePageRoutingModule } from './seller-profile-routing.module';
import { SellerProfilePage } from './seller-profile.page';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [SellerProfilePage]
})
export class SellerProfilePageModule {}
