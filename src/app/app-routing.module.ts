import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guards';
import { RoleGuard } from './guards/role.guard';

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
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-client',
    loadChildren: () => import('./pages/profile-client/profile-client.module').then(m => m.ProfileClientPageModule),
    canActivate: [AuthGuard]
  },
  // RUTAS PARA PRODUCT-DETAIL - AMBAS VERSIONES
  {
    path: 'product-detail/:id',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-detail',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'seller',
    loadChildren: () => import('./pages/seller/seller.module').then(m => m.SellerPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR'] }
  },
  {
    path: 'seller-profile',
    loadChildren: () => import('./pages/seller-profile/seller-profile.module').then(m => m.SellerProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  // Ruta comodín para 404 - debe ser la última
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }