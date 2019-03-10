import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Branch } from '../../models/branch';
import { Course } from '../../models/course';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent implements OnInit {
  branches: Array<Branch> = new Array<Branch>();
  courses: Array<Course> = new Array<Course>();
  users: Array<User> = new Array<User>();
  branch = new Branch();
  course = new Course();
  user = new User();
  closeResult: string;
  modalReference: NgbModalRef;
  loading:boolean;

  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    private auth: AuthService,
    private route: Router
  ) {

  }

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    this.getBranches();
    this.getCourses();
    
  }

  getBranches(): any {
    this.loading = true; 
    this.service.get(Constants.branch).subscribe(resp => {
      this.bindBranches(resp.data);
      this.loading = false; 
    });
  }
  getUsers(): any {
    this.loading = true; 
    this.service.get(Constants.user).subscribe(resp => {
      this.bindUsers(resp.data);
      this.loading = false; 
    });
  }

  getCourses(): any {
    this.loading = true; 
    this.service.get(Constants.course).subscribe(resp => {
      this.bindCourses(resp.data);
      this.loading = false; 
    });
  }

  bindBranches(data: Array<Branch>) {
    this.branches = data;
  }

  bindCourses(data: Array<Course>) {
    this.courses = data;
  }

  bindUsers(data: Array<User>) {
    this.users = data;
  }

  saveBranchDetails() {
    this.loading = true; 
    this.service.post(Constants.branch, this.branch).subscribe(resp => {
      console.log(resp);
      this.getBranches();
      this.modalReference.close();
      this.loading = true; 
    });
  }

  saveCourseDetails() {
    const userId = +this.auth.getUserId();
    this.course.createdBy = userId;
    this.course.updatedBy = userId;
    this.service.post(Constants.course, this.course).subscribe(resp => {
      this.getCourses();
      this.modalReference.close();
    });
  }

  onModalClick(content) {
    this.modalReference = this.modalService.open(content);
  }
}
