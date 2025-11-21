import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeQuiz } from './take-quiz';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { QuizStore } from '../../../lib/stores/quiz.store';

describe('TakeQuiz', () => {
  let component: TakeQuiz;
  let fixture: ComponentFixture<TakeQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeQuiz],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        QuizStore,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
