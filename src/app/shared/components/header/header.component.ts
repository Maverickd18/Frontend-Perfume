import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showSearchbar: boolean = true;
  @Input() brands: string[] = [];

  @Output() homeClicked = new EventEmitter<void>();
  @Output() cartClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();

  onHomeClick() {
    this.homeClicked.emit();
  }

  onCartClick() {
    this.cartClicked.emit();
  }

  onProfileClick() {
    this.profileClicked.emit();
  }

  onLogoutClick() {
    this.logoutClicked.emit();
  }
}
