import { Component } from '@angular/core';

@Component({
  selector: 'app-intro-page',
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold">Welcome to Sandbox</h1>
      <p class="mt-2">
        This project was generated with <a href="https://github.com/angular/angular-cli" class="text-blue-500 underline">Angular CLI</a> version 18.1.0.
      </p>
      <h2 class="text-xl font-semibold mt-4">Development server</h2>
      <p class="mt-2">
        Run <code class="bg-gray-200 p-1 rounded">ng serve</code> for a dev server. Navigate to <a href="http://localhost:4200" class="text-blue-500 underline">http://localhost:4200</a>. The application will automatically reload if you change any of the source files.
      </p>
      <h2 class="text-xl font-semibold mt-4">Code scaffolding</h2>
      <p class="mt-2">
        Run <code class="bg-gray-200 p-1 rounded">ng generate component component-name</code> to generate a new component. You can also use <code class="bg-gray-200 p-1 rounded">ng generate directive|pipe|service|class|guard|interface|enum|module</code>.
      </p>
      <h2 class="text-xl font-semibold mt-4">Build</h2>
      <p class="mt-2">
        Run <code class="bg-gray-200 p-1 rounded">ng build</code> to build the project. The build artifacts will be stored in the <code class="bg-gray-200 p-1 rounded">dist/</code> directory.
      </p>
      <h2 class="text-xl font-semibold mt-4">Running unit tests</h2>
      <p class="mt-2">
        Run <code class="bg-gray-200 p-1 rounded">ng test</code> to execute the unit tests via <a href="https://karma-runner.github.io" class="text-blue-500 underline">Karma</a>.
      </p>
      <h2 class="text-xl font-semibold mt-4">Running end-to-end tests</h2>
      <p class="mt-2">
        Run <code class="bg-gray-200 p-1 rounded">ng e2e</code> to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
      </p>
      <h2 class="text-xl font-semibold mt-4">Further help</h2>
      <p class="mt-2">
        To get more help on the Angular CLI use <code class="bg-gray-200 p-1 rounded">ng help</code> or go check out the <a href="https://angular.io/cli" class="text-blue-500 underline">Angular CLI Overview and Command Reference</a> page.
      </p>
    </div>
  `,
  styles: [],
})
export class IntroPage {}
