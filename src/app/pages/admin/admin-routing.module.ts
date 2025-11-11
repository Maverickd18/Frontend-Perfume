import { NgModule } from '@angular/core';
<<<<<<< HEAD
import { Routes, RouterModule } from '@angular/router';

=======
import { RouterModule, Routes } from '@angular/router';
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
<<<<<<< HEAD
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
=======
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
