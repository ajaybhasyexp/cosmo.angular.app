import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgDatepickerModule } from 'ng2-datepicker';
import { Student } from '../../models/student';

@Component({
  selector: 'app-fee-payment',
  templateUrl: './fee-payment.component.html',
  styleUrls: ['./fee-payment.component.scss']
})
export class FeePaymentComponent implements OnInit {
  loading: boolean;
  url: string;
  deleteobject: any;
  modalReference: NgbModalRef;
  auth: AuthService;
  students: Array<Student> = new Array<Student>();

  receiptForm = new FormGroup({
    studentName: new FormControl(null, Validators.required),
    courseName: new FormControl(null, Validators.required),
    amount: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    paymentMode: new FormControl(null, Validators.required),
    paymentRefrence: new FormControl('', Validators.required),
    remarks: new FormControl('', Validators.required)

  });
  public btnSubmited = false;
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    auth: AuthService,
    private route: Router
  ) { this.auth = auth; }

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    this.GetStudent();
  }
  GetStudent() {
    this.loading = true;
    this.service.get(Constants.student.replace('branchId', this.auth.getBranchId())).subscribe(resp => {
      this.bindStudents(resp.data);
      this.loading = false;
    });
  }
  bindStudents(data: Array<Student>) {
    this.students = data;
  }
  SaveReceiptDetails()
  {
    const userId = +this.auth.getUserId();
    this.btnSubmited = true;
    if (this.receiptForm.valid) {
    }
  }
}
