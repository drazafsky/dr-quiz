import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDetailsPage } from './quiz-details-page';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('QuizDetailsPage', () => {
  let component: QuizDetailsPage;
  let fixture: ComponentFixture<QuizDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizDetailsPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
