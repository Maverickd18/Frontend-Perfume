import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.scss'],
  standalone: false
})
export class HeaderButtonsComponent {
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
