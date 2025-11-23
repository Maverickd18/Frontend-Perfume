import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { CardComponent } from './components/card/card.component';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ModerationBadgeComponent } from './components/moderation-badge/moderation-badge.component';

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
    StepperComponent,
    ImageUploadComponent,
    ModerationBadgeComponent,
    HeaderButtonsComponent,  // Agregar este
    SearchbarComponent       // Agregar este
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CardComponent,
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
    StepperComponent,
    ImageUploadComponent,
    ModerationBadgeComponent,
    HeaderButtonsComponent,  // Agregar este
    SearchbarComponent,      // Agregar este
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }