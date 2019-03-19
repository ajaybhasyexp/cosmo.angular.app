import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(private route: Router) { }

  login(data) {
    localStorage.setItem(Constants.tokenKey, data.token);
    localStorage.setItem(Constants.userId, data.userId);
    localStorage.setItem(Constants.role, data.role);
    return true;
  }
  setBranch(data) {
    localStorage.setItem(Constants.branch, JSON.stringify(data));
  }
  getBranch() {
    return JSON.parse(localStorage.getItem(Constants.branch));
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['login']);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  getToken() {
    return localStorage.getItem(Constants.tokenKey);
  }

  getUserId() {
    return localStorage.getItem(Constants.userId);
  }
  getBranchId() {
    return localStorage.getItem(Constants.branch);
  }

  isSuperAdmin(): boolean {
    if (localStorage.getItem('role') === 'Superadmin') {
      return true;
    } else {
      return false;
    }
  }
}
