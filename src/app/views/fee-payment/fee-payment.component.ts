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
import { StudentCourse } from '../../models/studentCourse';
import { of } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { isNgTemplate } from '@angular/compiler';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

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
  students: Array<any> = new Array<any>();
  courses: Array<any> = new Array<any>();
  studentCourse: Array<StudentCourse> = new Array<StudentCourse>();
  courseFee: number;
  selectedStudent: number;

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
    private route: Router, private parserFormatter: NgbDateParserFormatter
  ) { this.auth = auth; }

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    this.GetStudents();
  }

  GetStudents() {
    this.loading = true;
    this.service.get(Constants.studentAssignUnpaid.replace('branchId', this.auth.getBranchId())).subscribe(resp => {
      if (resp.isSuccess) {
        this.bindStudents(resp.data);
      }
    });
  }

  changeStudent() {
    this.selectedStudent = this.receiptForm.get('studentName').value;
    this.courses = this.studentCourse.filter(s => s.studentId === this.selectedStudent);
  }

  changeCourse() {
    const selectedCourse = this.receiptForm.get('courseName').value;
    this.courseFee = this.studentCourse.filter(s => s.studentId === this.selectedStudent && s.courseId === selectedCourse)[0].amount;
    this.receiptForm.controls['amount'].setValue(this.courseFee);
  }

  bindStudents(data: any) {
    this.studentCourse = data;
    this.students = this.getUniqueStudents();
    console.log(this.students);
    this.loading = false;
  }

  ResetForm() {
    this.receiptForm.reset();
    this.btnSubmited = false;
  }

  SaveReceiptDetails() {
    const userId = +this.auth.getUserId();
    this.btnSubmited = true;
    if (this.receiptForm.valid) {
    }
  }

  getUniqueStudents() {
    const flags = [], output = [], l = this.studentCourse.length;
    let i: number;
    for (i = 0; i < l; i++) {
      if (flags[this.studentCourse[i].studentId]) {
        continue;
      }
      flags[this.studentCourse[i].studentId] = true;
      output.push(this.studentCourse[i]);
    }
    return output;
  }

}
