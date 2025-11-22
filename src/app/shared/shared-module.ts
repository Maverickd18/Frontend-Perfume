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
<<<<<<< HEAD
import { CardComponent } from './components/card/card.component';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
=======
import { ModerationBadgeComponent } from './components/moderation-badge/moderation-badge.component';
>>>>>>> 0753791a7806ce6872ea4c24f76f2f923f17145e

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
    StepperComponent,
    ImageUploadComponent,
<<<<<<< HEAD
    HeaderButtonsComponent,
    SearchbarComponent
=======
    ModerationBadgeComponent // ← Agregar este
>>>>>>> 0753791a7806ce6872ea4c24f76f2f923f17145e
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
    ModerationBadgeComponent, // ← Agregar este
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
<<<<<<< HEAD
    IonicModule,
    ImageUploadComponent,
    HeaderButtonsComponent,
    SearchbarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
=======
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ← Agregar esto
>>>>>>> 0753791a7806ce6872ea4c24f76f2f923f17145e
})
export class SharedModule { }