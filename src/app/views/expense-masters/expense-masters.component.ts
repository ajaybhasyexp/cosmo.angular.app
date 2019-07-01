import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import { IncomeHead } from '../../models/incomehead';
import { ExpenseHead } from '../../models/expensehead';

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
  expenseHead: ExpenseHead = new ExpenseHead();
  expenseHeads: Array<ExpenseHead> = new Array<ExpenseHead>();

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
    this.getExpenseHeads();
  }

  getIncomeHeads() {
    this.service.get(Constants.incomehead).subscribe(resp => {
      this.bindIncomeHeads(resp.data);

    });
  }

  getExpenseHeads() {
    this.service.get(Constants.expenseHead).subscribe(resp => {
      this.bindExpenseHeads(resp.data);

    });
  }
  bindIncomeHeads(data: Array<IncomeHead>) {
    this.incomeHeads = data;
  }
  bindExpenseHeads(data: Array<ExpenseHead>) {
    this.expenseHeads = data;
    console.log(data);
  }

  onIncomeHeadModalClick(content, type: number, id: number) {
    this.incomeHeadForm.reset();
    this.btnIncomeHeadSubmited = false;
    this.incomeHead = new IncomeHead();
    if (type == 2) //edit
    {
      this.loading = true;
      this.service.get(Constants.incomeHead + '/' + id).subscribe(resp => {
        this.BindIncomeHead(resp.data);
        this.incomeHead = resp.data;
        this.loading = false;
      });
    }
    this.modalReference = this.modalService.open(content);
  }
  BindIncomeHead(data: IncomeHead) {
    this.incomeHeadForm.setValue({
      incomeHeadName: data.name,
      incomeHeadDescription: data.description,

    });
  }
  onExpenseHeadModalClick(content: any, type: number, id: number) {
    this.expenseHeadForm.reset();
    this.btnExpenseHeadSubmited = false;
    this.expenseHead = new ExpenseHead();
    if (type === 2) {
      this.loading = true;
      this.service.get(Constants.expenseHead + '/' + id).subscribe(resp => {
        this.BindExpenseHead(resp.data);
        this.expenseHead = resp.data;
        this.loading = false;
      });

    }
    this.modalReference = this.modalService.open(content);
  }
  BindExpenseHead(data: ExpenseHead) {
    this.expenseHeadForm.setValue({
      expenseHeadName: data.name,
      expenseHeadDescription: data.description,

    });
  }
  saveIncomeHead() {
    this.btnIncomeHeadSubmited = true;
    if (this.incomeHeadForm.valid) {
      this.incomeHead.description = this.incomeHeadForm.get('incomeHeadDescription').value;
      this.incomeHead.name = this.incomeHeadForm.get('incomeHeadName').value;
      const userId = +this.auth.getUserId();
      this.incomeHead.createdBy = userId;
      this.incomeHead.updatedBy = userId;
      //console.log(this.incomeHead); return false;
      this.loading = true;
      this.service.post(Constants.incomehead, this.incomeHead).subscribe(resp => {
        this.modalReference.close();
        this.incomeHeadForm.reset();
        this.getIncomeHeads();
        this.ShowResponse(resp);
      });
      this.btnIncomeHeadSubmited = false;
    }
  }

  saveExpenseHead() {
    this.btnExpenseHeadSubmited = true;
    if (this.expenseHeadForm.valid) {
      this.expenseHead.description = this.expenseHeadForm.get('expenseHeadDescription').value;
      this.expenseHead.name = this.expenseHeadForm.get('expenseHeadName').value;
      const userId = +this.auth.getUserId();
      this.expenseHead.createdBy = userId;
      this.expenseHead.updatedBy = userId;
      //console.log(this.expenseHead); return false;
      this.loading = true;
      this.service.post(Constants.expenseHead, this.expenseHead).subscribe(resp => {
        this.modalReference.close();
        this.incomeHeadForm.reset();
        this.getExpenseHeads();
        this.ShowResponse(resp);
      });
      this.btnExpenseHeadSubmited = false;
    }

  }
  onDeleteModalClick(content: any, deleteobject: any, url: string) {
    //console.log(deleteobject); return false;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteobject = deleteobject;
        this.url = url;
        this.loading = true;
        this.deleteItem();
      }
    });

  }
  deleteItem() {
    this.service.delete(this.url, this.deleteobject).subscribe(resp => {
      this.loading = false;
      this.deleteResponse(resp);
      if (resp.isSuccess) {
        this.getIncomeHeads();
        this.getExpenseHeads();
      }
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
