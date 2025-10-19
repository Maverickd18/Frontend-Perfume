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

  @Output() homeClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();

  onHomeClick() {
    this.homeClicked.emit();
  }

  onProfileClick() {
    this.profileClicked.emit();
  }

  onLogoutClick() {
    this.logoutClicked.emit();
  }

  onBackClick() {
    this.backClicked.emit();
  }
}
