import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
<<<<<<< HEAD
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http'; // ✅ Importante para consumir APIs
=======
import { HttpClientModule } from '@angular/common/http';
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
=======
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthService } from './services/auth';

// ✅ Importa tu servicio de autenticación (si ya lo creaste)
=======
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a

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
<<<<<<< HEAD
>>>>>>> eff78bfab41a9c73ad2afac014b4313ca20e9669
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2
=======
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
  bootstrap: [AppComponent],
})
export class AppModule {}
