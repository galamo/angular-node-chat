import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
// import { io } from "socket.io-client"
import * as socket from "socket.io-client";

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
  public clients: Array<{ id: string, name: string }>
  constructor() {
    this.socketClient = null;
    this.message = "";
    this.content = [];
    this.userName = "";
    this.showHelloMessage = false;
    this.clients = [];

  }
  sendMessage() {
    if (!this.socketClient) return;
    console.log(`message sent ${this.message}`)
    this.socketClient.emit("message", this.message)
  }
  disconnect() {
    this.socketClient.disconnect()
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
      console.log(clients)
      this.clients = clients;
    })
    this.showHelloMessage = true;
  }
  ngOnInit() {

  }

}
