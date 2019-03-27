import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Constants } from '../../constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User;
  form;
  loading: boolean;
  public btnSubmited = false;
  public loginErrorStatus = false;
  constructor(private fb: FormBuilder, private apiService: ApiService,
    private auth: AuthService, private route: Router) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  ngOnInit() {
    if (this.auth.isLoggedIn() === true) {
      this.route.navigate(['masters']);
    }
  }

  login() {
    this.btnSubmited = true;
    this.loginErrorStatus = false;
    if (this.loginForm.valid) {
      this.loading = true;
      this.user = new User();
      this.user.userName = this.loginForm.value.username;
      this.user.password = this.loginForm.value.password;
      this.apiService.post(Constants.login, this.user).subscribe(data => {
        if (data.isSuccess === true) {
          this.auth.login(data.data);
          this.apiService.get(Constants.branch + '/' + data.data.branchId).subscribe(resp => {
            this.auth.setBranch(resp.data);
          });
          this.loading = false;
          this.route.navigate(['masters']);
        } else {
          this.loginErrorStatus = true;
          this.loading = false;
        }
        this.btnSubmited = false;
      });
    } else {
      return Constants.invalid;
    }
  }
}
