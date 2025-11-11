import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
<<<<<<< HEAD

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

=======
=======
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared-module';

import { AdminPageRoutingModule } from './admin-routing.module';
<<<<<<< HEAD
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
=======
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
import { AdminPage } from './admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
<<<<<<< HEAD
=======
    SharedModule,
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
=======
    SharedModule,
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
    AdminPageRoutingModule
  ],
  declarations: [AdminPage]
})
<<<<<<< HEAD
<<<<<<< HEAD
export class AdminPageModule {}
=======
export class AdminPageModule { }
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
=======
export class AdminPageModule { }
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
