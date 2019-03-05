import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
  modalReference = null;

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
    });
    // this.modalReference.close();
  }

  saveCourseDetails() {
    const userId = +this.auth.getUserId();
    this.course.createdBy = userId;
    this.course.updatedBy = userId;
    this.service.post(Constants.course, this.course).subscribe(resp => {
      this.getCourses();
    });
  }

  onModalClick(content) {
    this.modalReference = this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
