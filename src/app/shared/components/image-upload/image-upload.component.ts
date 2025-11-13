import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  standalone: false
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<File>(); // Cambiar de string a File
  @ViewChild('fileInput') fileInput!: ElementRef;

  imageUrl: string | null = null;
  isUploading = false;

  constructor() {}

  // Abrir el selector de archivos
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  // Cuando se selecciona un archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen');
        return;
      }

      // Crear preview temporal inmediatamente
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Emitir el archivo File (no string)
      this.imageUploaded.emit(file);
    }
  }

  // Cambiar imagen
  changeImage(): void {
    this.openFileSelector();
  }

  // Eliminar imagen - emitir null en lugar de string vacío
  removeImage(): void {
    this.imageUrl = null;
    this.imageUploaded.emit(null!); // Cambiar de '' a null
    // Limpiar el input file
    this.fileInput.nativeElement.value = '';
  }
} 