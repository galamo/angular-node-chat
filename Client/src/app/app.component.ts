import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs"
// import { io } from "socket.io-client"
import * as socket from "socket.io-client";

interface ChatClient {
  id: string, clientName: string
}


const HTTP_SERVER_URL = "http://localhost:5000"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private socketClient: any;
  public message: string;
  public content: Array<string>;
  public userName: string
  public showHelloMessage: boolean
  public clients: Array<ChatClient>
  public sendToUser: ChatClient;

  public isDivisibaleByThreeObservable: Observable<{ isDivisibaleByThree: false, number: 0 }>;
  public mySubscription: Subscription;
  public subscriberValue: number = 0;
  public isSubscriberDivisable: boolean;


  constructor() {
    this.socketClient = null;
    this.message = "";
    this.content = [];
    this.userName = "";
    this.showHelloMessage = false;
    this.clients = [];
    this.sendToUser = null

  }
  sendMessage() {
    if (!this.socketClient) return;
    console.log(`message sent ${this.message}`)
    if (this.sendToUser.clientName === "All") {
      this.socketClient.emit("message", this.message)
    } else {
      this.socketClient.emit("privateMessage", { message: this.message, sendToUserId: this.sendToUser.id })
    }


  }
  disconnect() {
    this.socketClient.disconnect()
  }

  onChangeSendTo(id) {
    const sendToUser = this.clients.find(r => r.id === id);
    console.log("sending to", sendToUser)
    this.sendToUser = sendToUser
  }

  connect() {
    if (!this.userName) {
      alert("Insert User Name")
      return;
    }
    this.socketClient = socket.io(HTTP_SERVER_URL)
    this.socketClient.emit("initUser", this.userName)
    this.socketClient.on("messageToAll", (message) => {
      console.log(`recieved message: ${message}`)
      this.content.push(message)
    })
    this.socketClient.on("listOfUsers", (clients) => {
      this.clients = clients;
      this.sendToUser = _getDefaultSendToUser(clients)
    })
    this.showHelloMessage = true;

    function _getDefaultSendToUser(clients) {
      if (!Array.isArray(clients)) return;
      const defaultSendToUser = clients.find(user => user.id === "ALL");
      return defaultSendToUser;

    }
  }
  subscribe() {
    this.mySubscription = this.isDivisibaleByThreeObservable.subscribe({
      next: (value) => {
        const { number, isDivisibaleByThree } = value
        const message = isDivisibaleByThree ? "is divisbale by three" : "is NOT divisbale by three";
        console.log(`Subscriber 1 Number: ${number} ${message}`)
        // if (isDivisibaleByThree) {
        this.subscriberValue = number;
        this.isSubscriberDivisable = isDivisibaleByThree
        // }
      },
      complete: () => {
        console.log("observer completed")
      },
      error: (value) => {
        console.log(value)
      }
    })
  }
  unsubscribe() {
    this.mySubscription.unsubscribe();
    console.log(`Subscriber 1 is not subscribed anymore`)
  }
  ngOnInit() {
    this.isDivisibaleByThreeObservable = Observable.create((observer) => {
      let number = 0;
      setInterval(() => {
        if (number % 3 === 0) {
          observer.next({ isDivisibaleByThree: true, number })
        } else {
          observer.next({ isDivisibaleByThree: false, number })
        }
        
        // if (number === 20) {
        //   throw new Error("Error in subscription")
        // }
        number++;
      }, 500)
    })
  }

}
