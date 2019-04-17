import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../constants';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-expense-masters',
  templateUrl: './expense-masters.component.html',
  styleUrls: ['./expense-masters.component.scss']
})
export class ExpenseMastersComponent implements OnInit {
  
  loading:boolean;
  url: string;
  deleteobject: any;
  modalReference: NgbModalRef;
  
  public btnIncomeHeadSubmited = false;
  public btnExpenseHeadSubmited = false;
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    private auth: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
  }

  incomeHeadForm = new FormGroup({
    incomeHeadName: new FormControl(null,Validators.required),
    incomeHeadDescription: new FormControl(null,Validators.required)
  });
  expenseHeadForm = new FormGroup({
    expenseHeadName: new FormControl(null,Validators.required),
    expenseHeadDescription: new FormControl(null,Validators.required)
  });
  onIncomeHeadModalClick(content,type:number,id:number) {
    this.incomeHeadForm.reset();
    if(type==2) //edit
    {    
      
    }
    this.modalReference = this.modalService.open(content);
  }
  onExpenseHeadModalClick(content,type:number,id:number) {
    this.expenseHeadForm.reset();
    if(type==2) //edit
    {    
      
      
    }
    this.modalReference = this.modalService.open(content);  
  }
  saveIncomeHead()
  {

    this.btnIncomeHeadSubmited = true;   
    if (this.incomeHeadForm.valid) {
      this.btnIncomeHeadSubmited = false;
    }
  }
  saveExpenseHead()
  {
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
