import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

=======
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared-module';

import { AdminPageRoutingModule } from './admin-routing.module';
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
import { AdminPage } from './admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
=======
    SharedModule,
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
    AdminPageRoutingModule
  ],
  declarations: [AdminPage]
})
<<<<<<< HEAD
export class AdminPageModule {}
=======
export class AdminPageModule { }
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
