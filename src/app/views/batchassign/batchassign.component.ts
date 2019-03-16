import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { Batch } from '../../models/batch';
import { Router } from '@angular/router';

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
  batches: Array<Batch> = new Array<Batch>();
  batch = new Batch();
  deleteObject = new Batch();

  ngOnInit() {}
}
