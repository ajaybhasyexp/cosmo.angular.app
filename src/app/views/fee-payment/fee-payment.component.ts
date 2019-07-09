import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StudentCourse } from '../../models/studentCourse';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FeePayment } from '../../models/feepayment';
import { Course } from '../../models/course';
import { Student } from '../../models/student';

@Component({
  selector: 'app-fee-payment',
  templateUrl: './fee-payment.component.html',
  styleUrls: ['./fee-payment.component.scss']
})
export class FeePaymentComponent implements OnInit {
  loading: boolean;
  auth: AuthService;
  students: Array<any> = new Array<any>();
  courses: Array<any> = new Array<any>();
  studentCourse: Array<StudentCourse> = new Array<StudentCourse>();
  courseFee: number;
  selectedStudent: number;
  selectedCourse: number;
  studentAssignId: number;
  feePayment = new FeePayment();
  branchId: string;
  branchName: string;
  studentName: string;
  courseName: string;
  @ViewChild('printButton') printButton: ElementRef<HTMLElement>;

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
    auth: AuthService,
    private route: Router, private parserFormatter: NgbDateParserFormatter
  ) { this.auth = auth; }

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    const branch = this.auth.getBranch();
    this.branchId = branch.id.toString();
    this.branchName = branch.branchName;
    this.GetStudents();
  }

  GetStudents() {
    this.loading = true;
    this.service.get(Constants.studentAssignUnpaid.replace('branchId', this.branchId)).subscribe(resp => {
      if (resp.isSuccess) {
        this.bindStudents(resp.data);
      }
    });
  }

  changeStudent() {
    this.selectedStudent = this.receiptForm.get('studentName').value;
    this.courses = this.studentCourse.filter(s => s.studentId === this.selectedStudent);
    console.log(this.courses);
  }

  changeCourse() {
    this.selectedCourse = this.receiptForm.get('courseName').value;
    const selected = this.studentCourse.filter(s => s.studentId === this.selectedStudent && s.courseId === this.selectedCourse)[0];
    this.courseFee = selected.amount;
    this.studentAssignId = selected.id;
    this.studentName = selected.studentName;
    this.courseName = selected.courseName;
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
    this.loading = true;
    const userId = +this.auth.getUserId();
    this.btnSubmited = true;
    if (this.receiptForm.valid) {
      this.feePayment.studentId = this.selectedStudent;
      this.feePayment.amount = this.receiptForm.get('amount').value;
      this.feePayment.courseId = this.selectedCourse;
      this.feePayment.paymentModeId = this.receiptForm.get('paymentMode').value;
      this.feePayment.reference = this.receiptForm.get('paymentRefrence').value;
      const date = this.parserFormatter.format(this.receiptForm.get('date').value);
      this.feePayment.receiptDate = date;
      this.feePayment.studentAssignmentId = this.studentAssignId;
      this.feePayment.userId = userId;
      this.service.post(Constants.studentAssignPay.replace('branchId', this.branchId), this.feePayment).subscribe(resp => {
        if (resp.isSuccess) {
          this.printAndClear();
        }
      });
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

  printAndClear() {
    this.loading = false;
    const btn: HTMLElement = this.printButton.nativeElement;
    btn.click();
    this.receiptForm.reset();
    this.GetStudents();
  }
}


