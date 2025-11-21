import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../types/question';

@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left">Prompt</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Point Value</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Required</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let question of questions" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ question.prompt }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ question.pointValue }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ question.required ? 'Yes' : 'No' }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ question.correctAnswer }}</td>
          </tr>
          <tr *ngIf="!questions || questions.length === 0">
            <td colspan="4" class="border border-gray-300 px-4 py-2 text-center">No questions available.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class QuestionTableComponent {
  @Input() questions: Question[] | undefined;
}
