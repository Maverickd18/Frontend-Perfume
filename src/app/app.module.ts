import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http'; // ✅ Importante para consumir APIs
=======
import { HttpClientModule } from '@angular/common/http';
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
<<<<<<< HEAD
import { AuthService } from './services/auth';

// ✅ Importa tu servicio de autenticación (si ya lo creaste)

@NgModule({
  declarations: [AppComponent],
<<<<<<< HEAD
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, // ✅ Necesario para peticiones HTTP
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService, // ✅ Agrega tu servicio aquí
  ],
=======
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
=======
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2
  bootstrap: [AppComponent],
})
export class AppModule {}
