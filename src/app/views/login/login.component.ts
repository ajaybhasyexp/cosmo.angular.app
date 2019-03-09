import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Constants } from '../../constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  user: User;
  form;
  constructor(private fb: FormBuilder, private apiService: ApiService,
    private auth: AuthService, private route: Router) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.auth.isLoggedIn() === true) {
      this.route.navigate(['masters']);
    }
  }

  login() {
    if (this.form.invalid) {
      return Constants.invalid;
    }
    this.user = new User();
    this.user.userName = this.form.value.username;
    this.user.password = this.form.value.password;
    this.apiService.post(Constants.login, this.user).subscribe(data => {
      this.auth.login(data);
    });
  }
}
