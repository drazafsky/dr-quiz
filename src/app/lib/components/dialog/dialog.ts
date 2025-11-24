import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dialog.html',
})
export class DialogComponent {
  @Input() isOpen: boolean = false;
}
