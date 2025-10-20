import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;
<<<<<<< HEAD
  @Input() backIcon: string = 'arrow-back';
  @Input() unreadNotifications: number = 0;
  
  @Output() backClicked = new EventEmitter<void>();
  @Output() notificationClicked = new EventEmitter<void>();

  constructor(private location: Location, private router: Router) {}

  onBackClick() {
    this.backClicked.emit();
    this.location.back();
  }

  onNotificationClick() {
    this.notificationClicked.emit();
    this.router.navigate(['/notifications']);
  }
}
=======
  @Input() showSearchbar: boolean = true;

  @Output() homeClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();
  @Output() filterClicked = new EventEmitter<void>(); // 👈 nuevo evento

  onHomeClick() { this.homeClicked.emit(); }
  onProfileClick() { this.profileClicked.emit(); }
  onLogoutClick() { this.logoutClicked.emit(); }
  onBackClick() { this.backClicked.emit(); }

  onFilterClick() { this.filterClicked.emit(); } // 👈 lo dispara
}
>>>>>>> client
