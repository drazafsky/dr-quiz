import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Answer } from '../../../lib/types/answer';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  convertToAnswerDTO(answer: Answer): Answer {
    const id = !!answer.id && answer.id !== 'create' ? answer.id : uuidv4();

    const dto: Answer = {
      ...answer,
      id,
    };

    return dto;
  }
}
