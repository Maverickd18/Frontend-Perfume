import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileClientPageRoutingModule } from './profile-client-routing.module';

import { ProfileClientPage } from './profile-client.page';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProfileClientPageRoutingModule
  ],
  declarations: [ProfileClientPage]
})
export class ProfileClientPageModule {}
