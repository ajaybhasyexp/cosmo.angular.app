import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  @ViewChild('warningModal') public warningModal: ModalDirective;
  branches: Array<Branch> = new Array<Branch>();
  courses: Array<Course> = new Array<Course>();
  users: Array<User> = new Array<User>();
  branch = new Branch();
  course = new Course();
  user = new User();
  closeResult: string;
  modalReference: NgbModalRef;
  loading: boolean;
  deleteobject: any;
  url: string;
  branchForm = new FormGroup({
    branchName: new FormControl('', Validators.required),
    branchAddress: new FormControl('', Validators.required),
    branchEmail: new FormControl('', [Validators.required, Validators.email]),
    branchPerson: new FormControl('', Validators.required),
    branchNumber: new FormControl('', Validators.required)
  });
  courseForm = new FormGroup({
    courseName: new FormControl('', Validators.required),
    courseDescription: new FormControl('', Validators.required)
  });
  userForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    userContactPerson: new FormControl('', Validators.required),
    userContactNumber: new FormControl('', Validators.required)
  });
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    public auth: AuthService,
    private route: Router
  ) { }

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
    console.log(this.branchForm.value);
    console.log(this.branchForm.status);
    if (this.branchForm.valid) {
      this.loading = true;
      this.service.post(Constants.branch, this.branch).subscribe(resp => {
        console.log(resp);
        this.getBranches();
        this.loading = false;
        this.modalReference.close();

      });
    }

  }

  saveCourseDetails() {
    if (this.courseForm.valid) {
      const userId = +this.auth.getUserId();
      this.course.createdBy = userId;
      this.course.updatedBy = userId;
      this.service.post(Constants.course, this.course).subscribe(resp => {
        this.getCourses();
        this.loading = false;
        this.modalReference.close();
      });
    }
  }

  saveUserDetails() {
    console.log(this.userForm.value);
    console.log(this.userForm.status);
  }

  onModalClick(content) {
    this.modalReference = this.modalService.open(content);
  }

  onDeleteModalClick(content, deleteobject: any, url: string) {
    this.modalReference = this.modalService.open(content);
    this.deleteobject = deleteobject;
    this.url = url;
  }
  closeModal() {
    this.modalReference.close();
  }

  deleteItem() {
    this.service.delete(this.url, this.deleteobject).subscribe(resp => {
      this.getCourses();
      this.getBranches();
      this.modalReference.close();
    });
  }

  getbranch(id: number) {
    this.service.get(Constants.branch + '/' + id).subscribe(resp => {
      this.bindBranch(resp.data);
    });
  }
  onEditModalClick(content, id) {
    this.getbranch(id);
    this.onModalClick(content);
  }
  bindBranch(data) {
    this.branch = data;
  }
}
