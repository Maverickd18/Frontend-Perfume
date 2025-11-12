import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  @Output() filtersChange = new EventEmitter<any>();

  value: string = '';

  onSearch() {
    this.filtersChange.emit({
      text: this.value.trim().toLowerCase()
    });
  }
}
