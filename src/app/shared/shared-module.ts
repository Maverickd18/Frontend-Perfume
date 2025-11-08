import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { CardComponent } from './components/card/card.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
    StepperComponent,
    CardComponent
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
    StepperComponent,
    CardComponent,
    SearchbarComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule { }