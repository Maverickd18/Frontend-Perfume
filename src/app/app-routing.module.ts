import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StoreGuard } from './guards/store.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'profile-seller',
    loadChildren: () => import('./pages/profile-seller/profile-seller.module').then(m => m.ProfileSellerPageModule),
    canActivate: [StoreGuard]
  },
  {
    path: 'profile-client',
    loadChildren: () => import('./pages/profile-client/profile-client.module').then( m => m.ProfileClientPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'seller',
    loadChildren: () => import('./pages/seller/seller.module').then(m => m.SellerPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [StoreGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }