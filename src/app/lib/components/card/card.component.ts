import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="card-content">
        <ng-content select="[content]"></ng-content>
      </div>
      <div class="card-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .card-header, .card-footer {
      padding: 8px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
    }
    .card-footer {
      border-top: 1px solid #eee;
    }
    .card-content {
      padding: 16px;
    }
  `]
})
export class CardComponent {}
