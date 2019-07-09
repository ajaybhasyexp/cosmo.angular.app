import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Branch } from '../models/branch';

@Injectable()
export class AuthService {
  constructor(private route: Router) { }
  loading: boolean;
  login(data) {
    localStorage.setItem(Constants.tokenKey, data.token);
    localStorage.setItem(Constants.userId, data.userId);
    localStorage.setItem(Constants.role, data.role);
    return true;
  }
  setBranch(data) {
    localStorage.setItem(Constants.branch, JSON.stringify(data));
  }
  getBranch(): Branch {
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
    return JSON.parse(localStorage.getItem(Constants.branch)).id;
  }

  isSuperAdmin(): boolean {
    if (localStorage.getItem('role') === 'Superadmin') {
      return true;
    } else {
      return false;
    }
  }

  ShowResponse(response: any) {
    console.log(response);
    if (response.isSuccess === true) {
      this.loading = false;
      Swal.fire(
        response.message,
        '',
        'success'
      );
    } else {
      this.loading = false;
      Swal.fire(
        response.message,
        '',
        'error'
      );
    }
  }
}
