import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;
  @Input() backIcon: string = 'arrow-back';
  
  @Output() backClicked = new EventEmitter<void>();

  onBackClick() {
    this.backClicked.emit();
  }
}