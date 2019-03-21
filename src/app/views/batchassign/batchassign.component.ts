import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Batch } from '../../models/batch';
import { Course } from '../../models/course';
import { Router } from '@angular/router';
import { BatchAssignment } from '../../models/batchassignment';
import { Branch } from '../../models/branch';

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
  ) { }

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
  });

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    } else {
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

  onModalClick(content: any) {
    this.getBranches();
    this.getCourses();
    this.getBatches();
    this.modalReference = this.modalService.open(content);
  }

  saveBatchAssignmentDetails() {
    this.service.post('batchassignment', this.batchAssign).subscribe(resp => {
      this.getBatchAssigns();
    });
  }
}
