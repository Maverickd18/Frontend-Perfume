import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileClientPage } from './profile-client.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileClientPageRoutingModule {}
