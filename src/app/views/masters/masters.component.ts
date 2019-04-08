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
import { UserRole } from '../../models/userrole';
import { debug } from 'util';
import Swal from 'sweetalert2';
import { empty } from 'rxjs';



@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent implements OnInit {
  @ViewChild('warningModal') public warningModal: ModalDirective;
  auth: AuthService;
  branches: Array<Branch> = new Array<Branch>();
  courses: Array<Course> = new Array<Course>();
  users: Array<User> = new Array<User>();
  userRoles: Array<UserRole> = new Array<UserRole>();
  branch = new Branch();
  course = new Course();
  user = new User();
  userRole = new UserRole();
  closeResult: string;
  modalReference: NgbModalRef;
  loading: boolean;
  deleteobject: any;
  url: string;
  userRoleIdSelected: number;
  adminIdSelected: number;
  branchIdSelected: number;
  branchForm = new FormGroup({
    branchName: new FormControl('', Validators.required),
    branchAddress: new FormControl('', Validators.required),
    branchEmail: new FormControl('', [Validators.required, Validators.email]),
    branchPerson: new FormControl('', Validators.required),
    branchNumber: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    adminId: new FormControl('')
  });
  courseForm = new FormGroup({
    courseName: new FormControl('', Validators.required),
    courseDescription: new FormControl('', Validators.required)
  });
  userForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
    // userContactNumber: new FormControl('',[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)] ),
    userRoleId: new FormControl('', Validators.required),
    branchId: new FormControl('')


  });

  public btnBranchSubmited = false;
  public btnCourseSubmited = false;
  public btnUserSubmited = false;

  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    auth: AuthService,
    private route: Router
  ) {
    this.auth = auth;
  }

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    this.loading = true;
    this.getBranches();
    this.getCourses();
    this.getUsers();
    this.getUserRoles();
  }

  getBranches(): any {
    this.service.get(Constants.branch).subscribe(resp => {
      this.bindBranches(resp.data);

    });
  }
  getUsers(): any {
    if (this.auth.isSuperAdmin()) {
      this.service.get(Constants.userall.replace('branchid', '0')).subscribe(resp => {
        this.bindUsers(resp.data);
      });

    } else {
      this.service.get(Constants.userall.replace('branchid', this.auth.getBranchId())).subscribe(resp => {
        this.bindUsers(resp.data);
      });
    }
  }

  getCourses(): any {
    this.service.get(Constants.course).subscribe(resp => {
      this.bindCourses(resp.data);
    });
  }

  getUserRoles(): any {
    this.service.get(Constants.roles).subscribe(resp => {
      this.bindUserRoles(resp.data);
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

  bindUserRoles(data: Array<UserRole>) {
    this.userRoles = data;
    this.loading = false;
  }

  saveBranchDetails() {
    this.btnBranchSubmited = true;
    if (this.branchForm.valid) {
      this.branch.adminId = this.branchForm.controls.adminId.value;
      this.loading = true;
      this.service.post(Constants.branch, this.branch).subscribe(resp => {
        this.modalReference.close();
        this.btnBranchSubmited = false;
        this.ShowResponse(resp);
        this.getBranches();
      });
    }

  }

  saveCourseDetails() {
    this.btnCourseSubmited = true;
    if (this.courseForm.valid) {
      this.loading = true;
      const userId = +this.auth.getUserId();
      this.course.createdBy = userId;
      this.course.updatedBy = userId;
      this.service.post(Constants.course, this.course).subscribe(resp => {
        this.modalReference.close();
        this.btnCourseSubmited = false;
        this.ShowResponse(resp);
        this.getCourses();
      });
    }

  }

  saveUserDetails() {
    this.btnUserSubmited = true;
    if (this.userForm.valid) {
      this.loading = true;
      const userId = +this.auth.getUserId();
      this.user.createdBy = userId;
      this.user.updatedBy = userId;
      this.user.userRoleId = this.userForm.controls.userRoleId.value;
      this.user.branchId = this.userForm.controls.branchId.value;
      this.service.post(Constants.user, this.user).subscribe(resp => {
        this.modalReference.close();
        this.btnUserSubmited = false;
        this.ShowResponse(resp);
        this.getUsers();
      });
    }


  }

  onUserModalClick(content, type: number) {
    if (type === 1) {
      this.user = new User();
      this.branchIdSelected = 2;
      this.userRoleIdSelected = 2;
    }
    this.modalReference = this.modalService.open(content);

  }
  onBranchModalClick(content, type: number) {
    if (type === 1) {
      this.branch = new Branch();
      this.adminIdSelected = 2;
    }
    this.modalReference = this.modalService.open(content);

  }
  onCourseModalClick(content, type: number) {
    if (type === 1) {
      this.course = new Course();
    }
    this.modalReference = this.modalService.open(content);

  }
  onDeleteModalClick(content: any, deleteobject: any, url: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteobject = deleteobject;
        this.url = url;
        this.loading = true;
        this.deleteItem();
      }
    });

  }
  closeModal() {
    this.modalReference.close();

  }

  deleteItem() {
    this.service.delete(this.url, this.deleteobject).subscribe(resp => {
      this.loading = false;
      this.deleteResponse(resp);
      if (resp.isSuccess) {
        this.getCourses();
        this.getBranches();
        this.getUsers();
      }
    });
  }

  onBranchEditModalClick(content: any, id: number) {
    this.branch = null;
    this.loading = true;
    this.service.get(Constants.branch + '/' + id).subscribe(resp => {
      this.branch = resp.data;
      this.adminIdSelected = resp.data.adminId;
      this.loading = false;
    });
    // this.branch = this.branches.find(x => x.id === id);
    this.onBranchModalClick(content, 2);

    // this.adminIdSelected=this.branches.find(x => x.id === id).adminId;
  }

  onCourseEditModalClick(content: any, id: number) {
    this.course = null;
    this.loading = true;
    this.service.get(Constants.course + '/' + id).subscribe(resp => {
      this.course = resp.data;
      this.loading = false;
    });
    // this.course = this.courses.find(x => x.id === id);
    this.onCourseModalClick(content, 2);
  }
  onUserEditModalClick(content: any, id: number) {
    this.user = null;
    this.loading = true;
    this.service.get(Constants.user + '/' + id).subscribe(resp => {
      this.user = resp.data;
      this.branchIdSelected = resp.data.branchId;
      this.userRoleIdSelected = resp.data.userRoleId;
      this.loading = false;
    });
    this.onUserModalClick(content, 2);
  }
  ShowResponse(response: any) {
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
  deleteResponse(response: any) {
    if (response.isSuccess) {
      Swal.fire(
        'Deleted!!',
        '',
        'success'
      );
    } else {
      Swal.fire(
        response.message,
        '',
        'error'
      );
    }

  }
}


