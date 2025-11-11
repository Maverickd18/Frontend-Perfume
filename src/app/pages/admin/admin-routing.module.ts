import { NgModule } from '@angular/core';
<<<<<<< HEAD
<<<<<<< HEAD
import { Routes, RouterModule } from '@angular/router';

=======
import { RouterModule, Routes } from '@angular/router';
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
=======
import { RouterModule, Routes } from '@angular/router';
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
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
<<<<<<< HEAD
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
=======
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
=======
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
