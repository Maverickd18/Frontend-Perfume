import { Component, OnInit } from '@angular/core';
import { IonSearchbar } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [IonSearchbar, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  value: string = '';
  showClearButton: 'never' | 'focus' | 'always' = 'focus';

  onInput(ev: any) {
    // Support both Ionic event shapes
    const v = ev?.target?.value ?? ev?.detail?.value;
    if (v !== undefined) this.value = v;
  }

  onClear(_ev: any) {
    this.value = '';
  }

}
