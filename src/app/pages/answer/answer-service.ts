import { Injectable } from '@angular/core';
import { Answer } from '../../lib/types/answer';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  convertToAnswerDTO(answer: Answer): Answer {
    const id = !!answer.id && answer.id !== 'create' ? answer.id : uuidv4();
    const value = !!answer.value ? answer.value : '';

    const dto: Answer = {
      ...answer,
      id,
      value,
    };

    return dto;
  }
}
