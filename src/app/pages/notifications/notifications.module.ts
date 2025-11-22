import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NotificationsPageRoutingModule } from './notifications-routing.module';
import { NotificationsPage } from './notifications.page';
import { SharedModule } from '../../shared/shared-module';
import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule,
    SharedModule
  ],
  declarations: [
    NotificationsPage,
    OrderDetailModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsPageModule { }
