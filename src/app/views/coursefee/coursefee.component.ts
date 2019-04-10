import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { CourseFee } from '../../models/coursefee';
import { Course } from '../../models/course';
import { Branch } from '../../models/branch';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coursefee',
  templateUrl: './coursefee.component.html',
  styleUrls: ['./coursefee.component.scss']
})
export class CoursefeeComponent implements OnInit {

  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    public auth: AuthService,
    private route: Router
  ) { }

  modalReference: NgbModalRef;
  loading: boolean;

  courseFee = new CourseFee();
  courseFees: Array<CourseFee> = new Array<CourseFee>();
  branches = new Array<Branch>();
  courses = new Array<Course>();
  userBranch = new Branch();

  courseFeeForm = new FormGroup({
    branchCtrl: new FormControl(
      this.auth.getBranch().id,
      Validators.required
    ),
    courseCtrl: new FormControl(null, Validators.required),
    feeStructureCtrl: new FormControl(null, Validators.required),
    creditsCtrl: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(4),
    ]),
    amountCtrl: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(5),
    ]),
  });

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    } else {
      this.userBranch = this.auth.getBranch();
    }
  }

  initLoad() {
    this.loading = true;
    this.getCourseFee();
    this.getBranches();
    this.getCourses();
  }

  getBranches() {
    if (this.auth.isSuperAdmin()) {
      this.service.get(Constants.branch).subscribe(p => {
        this.bindBranches(p.data);
      });
    } else {
      this.branches = new Array<Branch>();
      this.branches.push(this.userBranch);
    }
  }

  getCourses() {
    if (this.auth.isSuperAdmin()) {
      this.service.get(Constants.course).subscribe(p => {
        this.bindCourses(p.data);
      });
    } else {
      this.service.get(Constants.assignedcourse.replace('id', this.userBranch.id.toString())).subscribe(p => {
        this.bindCourses(p.data);
        this.loading = false;
      });
    }
  }

  getCourseFee() {
    let url = Constants.coursefeeall;
    if (this.auth.isSuperAdmin()) {
      url = url + '/0';
    } else {
      url = url + '/' + this.userBranch.id.toString();
    }
    this.service.get(url).subscribe(p => {
      this.bindCourseFees(p.data);
    });

  }

  onModalClick(content: any) {
    this.initLoad();
    this.modalReference = this.modalService.open(content);
    this.courseFeeForm.controls['branchCtrl'].setValue(this.userBranch.id);
  }

  onDeleteModalClick(deleteobject: CourseFee) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.deleteItem(deleteobject);
      }
    });
  }

  deleteItem(deleteObject: CourseFee) {
    this.service.delete(Constants.coursefee, deleteObject).subscribe((resp) => {
      if (!resp.isSuccess) {
        Swal.fire(resp.message, '', 'error');
      } else {
        Swal.fire('Deleted!!', '', 'success');
      }

      this.getCourseFee();
    });
  }

  bindBranches(data: Array<Branch>) {
    this.branches = data;
  }

  bindCourses(data: Array<Course>) {
    this.courses = data;
  }

  bindCourseFees(data: Array<CourseFee>) {
    this.courseFees = data;
  }

  saveCourseFeeStructure() {
    if (this.courseFeeForm.valid) {
      this.loading = true;
      const userId = +this.auth.getUserId();
      this.courseFee.createdBy = userId;
      this.courseFee.updatedBy = userId;
      this.courseFee.courseId = this.courseFeeForm.get(
        'courseCtrl'
      ).value;
      this.courseFee.branchId = this.courseFeeForm.get('branchCtrl').value;
      this.courseFee.amount = this.courseFeeForm.get('amountCtrl').value;
      this.courseFee.credits = this.courseFeeForm.get('creditsCtrl').value;
      this.courseFee.feeStructure = this.courseFeeForm.get('feeStructureCtrl').value;
      this.service
        .post(Constants.coursefee, this.courseFee)
        .subscribe(resp => {
          this.ShowResponse(resp);
          this.modalReference.close();
          this.getCourseFee();
          this.loading = false;
        });
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
