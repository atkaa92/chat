import { AuthService } from './../../services/auth.service';
import { ValidateService } from './../../services/validate.service';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesModule, FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  email: String;
  password: String;
  password2: String;

  constructor(private authService: AuthService,
    private router: Router,
    private validateService: ValidateService,
    private flashMsgs: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      password2: this.password2,
    }

    if (!this.validateService.validateRegister(user)) {
      this.flashMsgs.show('Fill up all fields', { cssClass: 'alert-danger', timeout: 3000 });
      return false;

    }

    if (!this.validateService.validateEmail(user.email)) {
      this.flashMsgs.show('enter valid email', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMsgs.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login'])
      } else {
        this.flashMsgs.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/register'])
      }
    });
  }
}
