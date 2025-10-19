import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SearchbarComponent
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
    SearchbarComponent,
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CardComponent
  ]
})
export class SharedModule { }