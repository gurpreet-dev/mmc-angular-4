import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()


export class EventsService {
  
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

}