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
import { ModerationBadgeComponent } from './components/moderation-badge/moderation-badge.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent,
    StepperComponent,
    ImageUploadComponent,
    ModerationBadgeComponent // ← Agregar este
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
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
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ← Agregar esto
})
export class SharedModule { }