import { Component, EventEmitter, Output } from '@angular/core';
import { IonSearchbar, IonSelect, IonSelectOption, IonRange, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [IonSearchbar, IonSelect, IonSelectOption, IonRange, IonLabel, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  @Output() filtersChange = new EventEmitter<any>();
  @Output() openFilterClick = new EventEmitter<void>();

  value: string = '';
  showClearButton: 'never' | 'focus' | 'always' = 'focus';
  category: string = '';
  size: string = '';
  priceRange: number[] = [0, 100];

  onInput(ev: any) {
    const v = ev?.target?.value ?? ev?.detail?.value;
    if (v !== undefined) {
      this.value = v;
      this.emitFilters();
    }
  }

  onClear(_ev: any) {
    this.value = '';
    this.emitFilters();
  }

  emitFilters() {
    this.filtersChange.emit({
      text: this.value.trim().toLowerCase(),
      category: this.category,
      size: this.size,
      priceRange: this.priceRange
    });
  }

  // Emitir evento cuando se pulsa el botón de filtro en la toolbar
  onFilterButton() {
    this.openFilterClick.emit();
  }
}
