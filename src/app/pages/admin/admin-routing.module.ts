import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminPage, data: { tab: 'dashboard' } },
      { path: 'users', component: AdminPage, data: { tab: 'users' } },
      { path: 'brands', component: AdminPage, data: { tab: 'brands' } },
      { path: 'categories', component: AdminPage, data: { tab: 'categories' } },
      { path: 'perfumes', component: AdminPage, data: { tab: 'perfumes' } },
      { path: 'orders', component: AdminPage, data: { tab: 'orders' } },
      { path: 'moderation', component: AdminPage, data: { tab: 'moderation' } },
      { path: 'reports', component: AdminPage, data: { tab: 'reports' } },
      { path: 'system', component: AdminPage, data: { tab: 'system' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
