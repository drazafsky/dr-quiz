# DrQuiz

## Overview

This project was created using Angular v20.

Per the instructions there is no backend service. All state is persisted locally in the user's browser via LocalStorage. This allows data to survive page refreshes and other events that would typically wipe out the in memory state of the application. However, this also means that data can't be loaded across browsers or browser profiles. Additionally, there is a limit on how much data can be stored though it should be enough for anyone to create a very large number of quizzes and take those quizzes without issues.

The application allows a user to create an unlimited (within browser localstorage memory limits) number of quizzes. The user can save a quiz part way through creation, persist the changes, and resume editing at any time. However, once the user has published the quiz, no further changes can be made to it.

Each quiz consists of one or more questions which each have one or more answers.

## Architecture

The application consists of an application shell which is the default page the user sees upon loading the application. From there, the user can navigate to the quiz list page (/quiz) or the create a quiz page (/quiz/create). These pages are lazy loaded as a separate js chunk file to optimize loading time when the user first enters the application.

### Data Storage

Data is stored as JSON objects inside LocalStorage. There are two keys used: QUIZZES and TESTS.

QUIZZES stores all the quizzes along with their associated questions and answers. An example of a stored quiz object is below. Aside from the fields that were outlined in the requirements document, each quiz has a guid `id` field. This is used to associate a taken test with the quiz template. The `timeLimit` field represents a number of seconds the user is allowed to spend taking a quiz. The only other field that is worth mentioning is the `isCorrect` field inside every answer for a question. In retrospect, this was a mistake and should have been saved as an id field on the question. Unfortunately, by the time I discovered that, I had used up enough time that I didn't want to spend more time refactoring it and not completing other parts of the project.

```
{
    "id": "84279030-4a04-4577-9a08-33d2de6aa1ae",
    "title": "Quiz now has a title",
    "description": "My First Quiz",
    "timeLimit": 3600,
    "shuffleQuestions": true,
    "questions": [
      {
        "id": "7b3eadf6-a04c-4568-86a8-45df9c53e795",
        "required": true,
        "pointValue": 1,
        "prompt": "Question #1",
        "answers": [
          {
            "id": "c2645975-da08-4098-834d-f0b01dba48f0",
            "value": "1",
            "isCorrect": true
          },
          {
            "id": "b2b5260d-ad60-47ac-82e0-824e6869435b",
            "value": "2",
            "isCorrect": false
          },
          {
            "id": "4da5ca49-acb8-41c6-a5a6-2e6c36d914e6",
            "value": "3",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "41d15734-3e97-44c3-a7a0-26fba4ec16d2",
        "required": false,
        "pointValue": 2,
        "prompt": "Question #2",
        "answers": [
          {
            "id": "ab7a7a24-8a9d-47df-9588-a2dc3f6cef3f",
            "value": "A",
            "isCorrect": false
          },
          {
            "id": "fce69a8f-202b-401c-805e-e8623a2a364f",
            "value": "B",
            "isCorrect": true
          },
          {
            "id": "30d1e198-6b33-47ff-a2b9-3330f268f5b8",
            "value": "C",
            "isCorrect": false
          }
        ]
      }
    ]
}
```
TESTS stores instances of a taken quiz. An example of a stored test object is below. The `id` field of a test matches the `id` field of a QUIZZES instance. This has one immediate impacts. One, a user can only take a quiz a single time as the id is the equivalent of a unique identifier and foreign key. I was unsure if limiting the user to taking a single instance of a quiz was correct or not but decided to treat it like most online grading software I've used and make it a one chance to pass feature. Within the `questions` property, the `id` field is used similary to identify which question within the quiz an answer belongs to. The `answer` field does the same for identify the answer within a quiz's question.

The `timeTaken` field counts the number of seconds the user has spent with the test open. I misunderstood the requirement for a deadline which should be time the user starts the test plus the quiz's `timeLimit` value. I instead, opted for a more difficult version where the time taken is tracked each time the user opens the test instance. This updates when the user saves the test, navigates away from the page, leaves the site entirely, or closes the browser. Quite a bit of this code could have been removed and some simplifications could have been made if I had used the correct method of determining when test time had run out.

```
{
    "id": "394cc199-25dd-40ca-b7eb-7eeb6f61e2f7",
    "questions": [
      {
        "id": "0e615726-66ab-4a07-ba28-4960ba670ebe",
        "answer": "05de8d9e-47c5-422c-b9f1-61443b4a6716"
      },
      {
        "id": "76c8c1a9-79fc-480e-8c16-a0934db3f47c",
        "answer": "904f3dfb-d8e5-4227-954a-c34c377dd921"
      }
    ],
    "isSubmitted": true,
    "timeTaken": 60,
    "score": 9
}
```

### Persistence

Data is persisted via the use of the various repo classes. By pulling this code out into it's own classes, we are able to swap the implementation for a different persistence (indexdb, api calls, etc.) mechanizism if we needed to by configuring Angular's dependency injection with an appropriate class.

### Data Stores

The persisted data is used and controlled by `QuizStore` and `TestStore`. These are based on `NgRx SignalStore` which is a lightweight version of `NgRx`. The SignalStore requires much less boilerplate than standard NgRx stores and integrates nicely into using effects and computed values within components and services. This also has a positive effect on performance especially when using zoneless Angular since properly used signals help to avoid unnecessary change detection cycles.

### Page Specific Services

Each page has it's own service that provides data such as route parameters as well as interfaces to the appropriate stores for CRUD operations. These services are mostly just pass through methods to the stores but help keep the page components cleaner.

### Page Components

Each page has it's own corresponding component. These components use their related service to fetch data, manipulate it for display purposes, and pass data back to the service for persistence. The pages also handle the logic for dynamically building/modifying forms for the user to interact with. This keeps the display related logic contained to the component while allowing the service to deal strictly with data.

### Improvements

There's a few improvements that could be made to break the components down into smaller more manageable chunks. As an example, the `QuizDetailsPage` template builds out the entire form for creating and editing a quiz. New components to represent a question and answer should be created and used. However, since there isn't anywhere that we are reusing those form elements, this would be a bit of premature optimization at this time.

The same could be done for elements like action bars to host buttons. Since it didn't seem like the point of the project was to recreate a UI suite, I opted to save time by not doing this. I could have pulled in a UI framework like Kendo or Angular Material but again, this seemed like overkill for a small throwaway project where a couple of Tailwind classes would get me 90% of what was needed.

The interface for creating a quiz could use a lot of improvement. Instead of showing all questions and answers for editing at all times. There's a number of ways to improve this but allowing editing a single question a time would be the best option. The same could be done for answers. This would reduce the number of buttons on the page, allow for smaller components with less logic, and ease the burden on the user.

The interface for taking a test could be improved by showing a single question at a time instead of all questions at once. For quizzes with a large number of questions and/or answers this would make the page much easier to digest for the user. This would require a bit of a change in the `TakeQuiz` component to cycle through the questions as the user submits them. This would require some decisions about if the user can go back to previously answered questions and change their answer before submitting the test.

### Known Bugs

- There is little feedback on if actions were triggered and what their result was (saving/publishing/submitting). Some form of feedback that an action is being taken and if it was successful should be added.
- There is no validation in place to ensure a question only has a single answer marked correct. This could be fixed with a custom validator on the appropriate form group but I ran out of time to implement this.
