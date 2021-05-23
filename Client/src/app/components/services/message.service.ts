import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public subject = new Subject<any>();
  constructor() {

  }

  sendMessage(message: string) {
    this.subject.next({ message })
  }

  clear() {
    this.subject.next({ message: "" })
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable()
  }

}
