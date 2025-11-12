import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() image: string = '';
  @Input() price: number | null = null;
  @Input() size: string = '';
  @Input() stock: number = 0;
  @Input() category: string = '';
  @Input() brand: string = '';

  @Output() viewProduct = new EventEmitter<void>();
  @Output() buyProduct = new EventEmitter<void>();

  onCardClick() {
    this.viewProduct.emit();
  }

}
