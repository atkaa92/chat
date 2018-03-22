import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  users: any = [];
  chats: any;
  chatTo: any = 'All Users';
  socket;
  message;
  user: Object;


  constructor(
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        this.flashMessage.show("Not Autherized", { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
        return false;
      })

    this.chatService.getOtherProfiles().subscribe(data => {
      this.users = data.users;
      this.chats = data.chats;
    },
      err => {
        console.log(err);
      })

    // socket
    this.socket = io()
  }

  onMessageSend(val) {
    this.socket.emit('chat', {
      userFrom: this.user,
      userTo: val.getAttribute('data-user-id'),
      message: this.message,
    });
  }


  changeMember(member){
    this.chatTo = member.innerText;
    Array.prototype.forEach.call(document.getElementsByClassName("chatWith"), function(el) {
      el.style.color = "#007bff";
      el.style.background = "#fff";
    });
    member.style.color = "#fff";
    member.style.background = "#007bff";
  }
}
