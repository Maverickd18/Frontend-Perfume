import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: 'primary' | 'secondary' | 'outline' | 'clear' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() expand: 'block' | 'full' | undefined = 'block';
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'start' | 'end' = 'start';
  @Input() loading: boolean = false;
  
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}