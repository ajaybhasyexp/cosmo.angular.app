import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';

import { Batch } from '../../models/batch';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    public auth: AuthService,
    private route: Router
  ) {}

  modalReference: NgbModalRef;
  loading: boolean;
  batches: Array<Batch> = new Array<Batch>();

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
}
