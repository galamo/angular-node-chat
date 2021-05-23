import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {
  public message: string;
  constructor(private messageService: MessageService) {
    this.message = "";
  }

  sendMessage(): void {
    this.messageService.sendMessage(this.message);
  }

  clearMessage() {
    this.messageService.clear()
  }
  ngOnInit(): void {
  }

}
