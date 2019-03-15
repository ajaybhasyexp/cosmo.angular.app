import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Batch } from '../../models/batch';

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
  ) {}

  modalReference: NgbModalRef;
  loading: boolean;
  batches: Array<Batch> = new Array<Batch>();
  batch = new Batch();

  ngOnInit() {}

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
  onDeleteModalClick(content: any, deleteobject: Batch) {
    this.modalReference = this.modalService.open(content);
    this.service.delete(Constants.batch,deleteobject);
  }

  onBatchEditModalClick(content: any, id: number) {
    this.batch = this.batches.find(x => x.id === id);
    this.onModalClick(content);
  }
}
