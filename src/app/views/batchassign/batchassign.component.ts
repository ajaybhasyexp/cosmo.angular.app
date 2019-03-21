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
  deleteObject = new BatchAssignment();
  branches = new Array<Branch>();
  courses = new Array<Course>();
  batches = new Array<Batch>();
  selectedBatches = new Array<Batch>();
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
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'batchName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
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
    console.log(data);
  }

  bindEditBatchAssign(data: BatchAssignment) {
    this.batchAssign = data;
  }

  onModalClick(content: any) {
    this.getBranches();
    this.getCourses();
    this.getBatches();
    this.modalReference = this.modalService.open(content);
  }
  onEdit(content: any, id: number) {
    console.log(id);
    this.service.get(Constants.batchassign + '/' + id).subscribe(resp => {
      this.batchAssignForm.controls['assignCourse'].setValue(
        resp.data.courseId
      );
      this.batchAssignForm.controls['assignBranch'].setValue(
        resp.data.branchId
      );
      this.modalReference = this.modalService.open(content);
    });
  }

  saveBatchAssignmentDetails() {
    if (this.batchAssignForm.valid) {
      const userId = +this.auth.getUserId();
      const batchAssign = new BatchAssignment();
      batchAssign.createdBy = userId;
      batchAssign.updatedBy = userId;
      batchAssign.batches = this.selectedBatches;
      batchAssign.isBranchWise = !this.auth.isSuperAdmin();
      batchAssign.courseId = this.batchAssignForm.get('assignCourse').value;
      batchAssign.branchId = this.batchAssignForm.get('assignBranch').value;
      this.service.post('batchassignment', batchAssign).subscribe(resp => {
        Swal.fire('Successfully Saved!!', '', 'success');
        this.modalReference.close();
        this.getBatchAssigns();
      });
    }
  }
}
