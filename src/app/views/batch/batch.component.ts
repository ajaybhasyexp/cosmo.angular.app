import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Batch } from '../../models/batch';
import { Router } from '@angular/router';

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
    this.modalReference = this.modalService.open(content);
    this.deleteObject = deleteobject;
  }

  onEdit(content: any, id: number) {
    this.batch = this.batches.find(x => x.id === id);
    this.onModalClick(content);
  }

  closeModal() {
    this.modalReference.close();
  }

  deleteItem() {
    this.service.delete(Constants.batch, this.deleteObject).subscribe(() => {
      this.getBatches();
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
}
