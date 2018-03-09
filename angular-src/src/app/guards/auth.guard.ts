import { FlashMessagesService } from 'angular2-flash-messages';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private flashMessage: FlashMessagesService , private authService: AuthService, private router: Router) { }

    canActivate() {
        if (this.authService.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['/login'])
            this.flashMessage.show("Not Autherized", { cssClass: 'alert-success', timeout: 3000 });
        }
    }
}
