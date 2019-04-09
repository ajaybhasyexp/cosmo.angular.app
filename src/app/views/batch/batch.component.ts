import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Batch } from '../../models/batch';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit {
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    public auth: AuthService,
    private route: Router
  ) { }

  modalReference: NgbModalRef;
  loading: boolean;
  batches: Array<Batch> = new Array<Batch>();
  batch = new Batch();
  deleteObject = new Batch();

  batchForm = new FormGroup({
    batchName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    this.getBatches();
  }

  onModalClick(content: any) {
    this.modalReference = this.modalService.open(content);
  }

  addModalClick(content: any) {
    this.batch = new Batch();
    this.modalReference = this.modalService.open(content);
  }

  getBatches(): any {
    this.loading = true;
    this.service.get(Constants.batch).subscribe(resp => {
      this.bindBatches(resp.data);
      this.loading = false;
    });
  }

  bindBatches(data: any) {
    this.batches = data;
  }

  onDelete(content: any, deleteobject: Batch) {
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

  onEdit(content: any, id: number) {
    this.loading = true;
    this.service.get(Constants.batch + '/' + id).subscribe(resp => {
      this.bindBatch(resp.data);
      this.loading = false;
      this.onModalClick(content);
    });
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

  closeModal() {
    this.modalReference.close();
  }

  deleteItem(deleteobject: Batch) {
    this.loading = true;
    this.service.delete(Constants.batch, deleteobject).subscribe(resp => {
      this.deleteResponse(resp);
      this.getBatches();
      this.loading = false;
      this.modalReference.close();
    });
  }

  saveBatchDetails() {
    const userId = +this.auth.getUserId();
    this.batch.createdBy = userId;
    this.batch.updatedBy = userId;
    this.service.post(Constants.batch, this.batch).subscribe(() => {
      this.getBatches();
      this.modalReference.close();
    });
  }

  bindBatch(batch: Batch) {
    this.batch = batch;
  }
}
