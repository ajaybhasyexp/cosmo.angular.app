import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Batch } from '../../models/batch';
import { Course } from '../../models/course';
import { Router } from '@angular/router';
import { BatchAssignment } from '../../models/batchassignment';
import { Branch } from '../../models/branch';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batchassign',
  templateUrl: './batchassign.component.html',
  styleUrls: ['./batchassign.component.scss']
})
export class BatchassignComponent implements OnInit {
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    public auth: AuthService,
    private route: Router
  ) {}

  modalReference: NgbModalRef;
  loading: boolean;
  batchAssigns: Array<BatchAssignment> = new Array<BatchAssignment>();
  batchAssign = new BatchAssignment();
  branches = new Array<Branch>();
  courses = new Array<Course>();
  batches = new Array<Batch>();
  dropdownSettings = {};

  batchAssignForm = new FormGroup({
    assignBranch: new FormControl(
      this.auth.getBranch().id,
      Validators.required
    ),
    assignCourse: new FormControl(null, Validators.required),
    assignBatch: new FormControl(null, Validators.required)
  });

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    } else {
      this.getBatchAssigns();
      this.getBranches();
      this.getCourses();
      this.getBatches();
    }
  }

  getBranches() {
    if (this.auth.isSuperAdmin()) {
      this.service.get(Constants.branch).subscribe(p => {
        this.bindBranches(p.data);
      });
    } else {
      this.branches = new Array<Branch>();
      this.branches.push(this.auth.getBranch());
    }
  }

  getBatchAssigns() {
    let url = Constants.batchassignall;
    if (this.auth.isSuperAdmin()) {
      url = url + '/0';
    } else {
      url = url + '/' + this.auth.getBranchId();
    }
    this.service.get(url).subscribe(p => {
      this.bindBatchAssigns(p.data);
    });
  }

  getCourses() {
    this.service.get(Constants.course).subscribe(p => {
      this.bindCourses(p.data);
    });
  }

  getBatches() {
    this.service.get(Constants.batch).subscribe(p => {
      this.bindBatches(p.data);
    });
  }

  bindBranches(data: Array<Branch>) {
    this.branches = data;
  }

  bindCourses(data: Array<Course>) {
    this.courses = data;
  }

  bindBatches(data: Array<Batch>) {
    this.batches = data;
  }

  bindBatchAssigns(data: Array<BatchAssignment>) {
    this.batchAssigns = data;
  }

  batchAssignFormReset() {
    this.batchAssignForm = new FormGroup({
      assignBranch: new FormControl(
        this.auth.getBranch().id,
        Validators.required
      ),
      assignCourse: new FormControl(null, Validators.required),
      assignBatch: new FormControl(null, Validators.required)
    });
  }

  onModalClick(content: any) {
    this.modalReference = this.modalService.open(content);
  }

  saveBatchAssignmentDetails() {
    if (this.batchAssignForm.valid) {
      const userId = +this.auth.getUserId();
      this.batchAssign.createdBy = userId;
      this.batchAssign.updatedBy = userId;
      this.batchAssign.isBranchWise = !this.auth.isSuperAdmin();
      this.batchAssign.courseId = this.batchAssignForm.get(
        'assignCourse'
      ).value;
      this.batchAssign.branchId = this.batchAssignForm.get(
        'assignBranch'
      ).value;
      this.batchAssign.batchId = this.batchAssignForm.get('assignBatch').value;
      this.service
        .post(Constants.batchassign, this.batchAssign)
        .subscribe(resp => {
          Swal.fire('Successfully Saved!!', '', 'success');
          this.modalReference.close();
          this.getBatchAssigns();
        });
    }
  }

  onDeleteModalClick(deleteobject: BatchAssignment) {
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

  deleteItem(deleteObject: BatchAssignment) {
    this.service.delete(Constants.batchassign, deleteObject).subscribe(() => {
      Swal.fire('Deleted!!', '', 'success');
      this.getBatchAssigns();
    });
  }
}
