import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css']
})
export class ReceiverComponent implements OnInit, OnDestroy {
  public messages: Array<string>;
  public subscription: Subscription;

  constructor(private messageService: MessageService) {
    this.messages = [];
    this.subscription = this.getSubscriber()
  }

  ngOnInit(): void {
  }
  getSubscriber() {
    return this.messageService.getMessage().subscribe((messageObj) => {
      const { message } = messageObj
      if (message) {
        this.messages.push(message)
      } else {
        this.messages = [];
      }
    })
  }
  mute() {
    this.subscription.unsubscribe()
  }
  unmute() {
    this.subscription = this.getSubscriber();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
