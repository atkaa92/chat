import { AuthService } from './auth.service';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {
  authToken: any;

  constructor(private http: Http, private authService:AuthService) { }

  getOtherProfiles() {
    let headers = new Headers();
    let body = '';
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://127.0.0.1:5000/chats', { headers: headers })
      .map(res => res.json())
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
}
