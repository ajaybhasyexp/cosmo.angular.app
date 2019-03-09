import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Branch } from '../../models/branch';
import { Course } from '../../models/course';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent implements OnInit {
  branches: Array<Branch> = new Array<Branch>();
  courses: Array<Course> = new Array<Course>();
  branch = new Branch();
  course = new Course();
  closeResult: string;
  modalReference: NgbModalRef;

  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    private auth: AuthService
  ) {
    this.getBranches();
    this.getCourses();
  }

  ngOnInit() {}

  getBranches(): any {
    this.service.get(Constants.branch).subscribe(resp => {
      this.bindBranches(resp.data);
    });
  }

  getCourses(): any {
    this.service.get(Constants.course).subscribe(resp => {
      this.bindCourses(resp.data);
    });
  }

  bindBranches(data: Array<Branch>) {
    this.branches = data;
  }

  bindCourses(data: Array<Course>) {
    this.courses = data;
  }

  saveBranchDetails() {
    this.service.post(Constants.branch, this.branch).subscribe(resp => {
      console.log(resp);
      this.getBranches();
      this.modalReference.close();
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
