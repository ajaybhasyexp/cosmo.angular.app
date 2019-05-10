import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { IncomeHead } from '../../models/incomehead';


@Component({
  selector: 'app-expense-masters',
  templateUrl: './expense-masters.component.html',
  styleUrls: ['./expense-masters.component.scss']
})
export class ExpenseMastersComponent implements OnInit {

  loading: boolean;
  url: string;
  deleteobject: any;
  modalReference: NgbModalRef;
  incomeHead: IncomeHead = new IncomeHead();
  incomeHeads: Array<IncomeHead> = new Array<IncomeHead>();

  public btnIncomeHeadSubmited = false;
  public btnExpenseHeadSubmited = false;

  incomeHeadForm = new FormGroup({
    incomeHeadName: new FormControl(null, Validators.required),
    incomeHeadDescription: new FormControl(null, Validators.required)
  });
  expenseHeadForm = new FormGroup({
    expenseHeadName: new FormControl(null, Validators.required),
    expenseHeadDescription: new FormControl(null, Validators.required)
  });

  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    private auth: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
    this.getIncomeHeads();
  }

  getIncomeHeads() {
    this.service.get(Constants.incomehead).subscribe(resp => {
      this.bindIncomeHeads(resp.data);
    });
  }

  bindIncomeHeads(data: Array<IncomeHead>) {
    this.incomeHeads = data;
  }

  onIncomeHeadModalClick(content, type: number, id: number) {
    this.incomeHeadForm.reset();
    if (type == 2) //edit
    {

    }
    this.modalReference = this.modalService.open(content);
  }

  onExpenseHeadModalClick(content: any, type: number, id: number) {
    this.expenseHeadForm.reset();
    if (type == 2) //edit
    {


    }
    this.modalReference = this.modalService.open(content);
  }

  saveIncomeHead() {
    this.incomeHead.description = this.incomeHeadForm.get('incomeHeadDescription').value;
    this.incomeHead.name = this.incomeHeadForm.get('incomeHeadName').value;
    const userId = +this.auth.getUserId();
    this.incomeHead.createdBy = userId;
    this.incomeHead.updatedBy = userId;
    this.service.post(Constants.incomehead, this.incomeHead).subscribe(resp => {
      this.modalReference.close();
      this.incomeHeadForm.reset();
      this.getIncomeHeads();
      this.ShowResponse(resp);
    });
    this.btnIncomeHeadSubmited = true;
    if (this.incomeHeadForm.valid) {
      this.btnIncomeHeadSubmited = false;
    }
  }

  saveExpenseHead() {
    this.btnExpenseHeadSubmited = true;
    if (this.expenseHeadForm.valid) {
      this.btnExpenseHeadSubmited = false;
    }
  }

  ShowResponse(response: any) {
    console.log(response);
    if (response.isSuccess === true) {
      this.loading = false;
      Swal.fire(
        response.message,
        '',
        'success'
      );
    } else {
      this.loading = false;
      Swal.fire(
        response.message,
        '',
        'error'
      );
    }
  }
}
