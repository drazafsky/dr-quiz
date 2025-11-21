import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar mb-4">
      <div class="toolbar-left">
        <ng-content select="[left]"></ng-content>
      </div>
      <div class="toolbar-right">
        <ng-content select="[right]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 8px;
      box-sizing: border-box;
    }
    .toolbar-left {
      display: flex;
      align-items: center;
    }
    .toolbar-right {
      display: flex;
      align-items: center;
    }
  `]
})
export class ToolbarComponent {}
