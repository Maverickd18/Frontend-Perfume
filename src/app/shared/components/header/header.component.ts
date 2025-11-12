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

  @Output() profileClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();

  onProfileClick() { 
    this.profileClicked.emit(); 
  }

  onLogoutClick() { 
    this.logoutClicked.emit(); 
  }
}
