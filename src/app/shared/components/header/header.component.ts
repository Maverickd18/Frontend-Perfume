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
  @Input() backIcon: string = 'arrow-back';
  @Input() unreadNotifications: number = 0;
  @Input() showNotifications: boolean = true;
  
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