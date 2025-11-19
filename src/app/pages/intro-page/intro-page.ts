import { Component } from '@angular/core';

@Component({
  selector: 'app-intro-page',
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold">Welcome to DR Quiz!</h1>
      <p class="mt-2">
        This applicaton allows you to create and take multiple choice quizzes.
      </p>
      <h2 class="text-xl font-semibold mt-4">Building Quizzes</h2>
      <ul class="mt-2 ml-8 list-decimal">
        <li>A quiz has: title, description, time limit (choose seconds or minutes and document your choice), and a shuffle questions boolean.</li>
        <li>Support multiple‑choice (single‑answer) questions.</li>
        <li>Each question has: required (boolean), point value (default 1), prompt, options, and exactly one correct answer.</li>
        <li>Users can add/remove questions while building a quiz.</li>
        <li>Users can save a draft and return later.</li>
        <li>Publishing locks the quiz—published quizzes cannot be edited.</li>
        <li>Validation: Users cannot publish an invalid quiz—show actionable errors.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-4">Taking a Quiz</h2>
      <ul class="mt-2 ml-8 list-decimal">
        <li>Start, pause/leave, resume; track time; lock when time's up.</li>
        <li>Show a list of quizzes with status: Not taken, In progress, Completed.</li>
        <li>Starting a quiz records a start time and deadline. Persist progress so a user can leave and resume where they left off.</li>
        <li>If time expires, the quiz is locked and the score is calculated.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-4">Scoring & Feedback</h2>
      <ul class="mt-2 ml-8 list-decimal">
        <li>Clear, immediate feedback and a results summary.</li>
        <li>Provide immediate feedback after each answer.</li>
        <li>On completion or timeout, show: score earned, max score, and percentage.</li>
        <li>Show a per‑question breakdown: user's answer, correct answer, points earned.</li>
      </ul>
    </div>
  `,
  styles: [],
})
export class IntroPage {}
