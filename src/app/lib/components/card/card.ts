import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border border-gray-300 rounded-lg shadow-md overflow-hidden">
      <div class="p-2 bg-gray-100 border-b border-gray-200">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="p-4">
        <ng-content select="[content]"></ng-content>
      </div>
      <div class="p-2 bg-gray-100 border-t border-gray-200">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {}
