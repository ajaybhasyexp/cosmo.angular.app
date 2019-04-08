import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// models
import { Student } from '../../models/student';
import { StudentAssignments } from '../../models/studentAssignments';
import { Branch } from '../../models/branch';
import { Course } from '../../models/course';
import { Batch } from '../../models/batch';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  loading: boolean;
  url: string;
  modalReference: NgbModalRef;
  auth: AuthService;

  branch = new Branch();
  course = new Course();
  student = new Student();
  batch = new Batch();
  studentAssignments = new StudentAssignments();

  studentForm = new FormGroup({
    studentName: new FormControl('', Validators.required),
    studentEmail: new FormControl('', Validators.required),
    studentContactNo: new FormControl('', Validators.required),
    studentAddress: new FormControl('', Validators.required)

  });

  studentDetailsForm = new FormGroup({
    studentQualification: new FormControl(1),
    studentProfession: new FormControl(1),
    studentSourceId: new FormControl(1),
    studentFeesPaid: new FormControl('', Validators.required)
  });
  studentAssignmentForm = new FormGroup({
    courseId: new FormControl(1),
    batchId: new FormControl(1),
    courseFeeId: new FormControl(1)
  });

  public btnSubmited = false;
  constructor(
    private service: ApiService,
    private modalService: NgbModal,
    auth: AuthService,
    private route: Router
  ) {
    this.auth = auth;
  }

  ngOnInit() {
    if (this.auth.isLoggedIn() !== true) {
      this.route.navigate(['login']);
    }
    this.getstudent();
  }


  getstudent() {
    this.loading = true;
    this.service.get(Constants.user).subscribe(resp => {
      this.bindStudents();
      this.loading = false;
    });
  }

  bindStudents() {

  }

  onStudentModalClick(content, type: number) {
    this.modalReference = this.modalService.open(content, { size: 'lg' });

  }

  onStep1Next(data) {
    this.btnSubmited = true;
    if (this.studentForm.valid) {
      console.log('Proceed');
      this.btnSubmited = false;
    }
  }

  SaveStudentDetails(data) {
    const userId = +this.auth.getUserId();

    this.student.studentName = this.studentForm.get('studentName').value;
    this.student.email = this.studentForm.get('studentEmail').value;
    this.student.contactNumber = this.studentForm.get('studentContactNo').value;
    this.student.address = this.studentForm.get('studentAddress').value;
    this.student.qualificationId = this.studentDetailsForm.get('studentQualification').value;
    this.student.professionId = this.studentDetailsForm.get('studentProfession').value;
    this.student.sourceId = this.studentDetailsForm.get('studentSourceId').value;
    this.student.feesPaid = this.studentDetailsForm.get('studentFeesPaid').value;
    this.student.createdBy = userId;
    this.student.updatedBy = userId;

    //  this.studentAssignments.courseId=this.studentAssignmentForm.get('courseId').value;
    //  this.studentAssignments.batchId=this.studentAssignmentForm.get('batchId').value;
    //  this.studentAssignments.courseFeeId=this.studentAssignmentForm.get('courseFeeId').value;
    //  this.studentAssignments.createdBy = userId;
    //  this.studentAssignments.updatedBy = userId;

    console.log(this.student);
    return false;
    this.service.post(Constants.batchassign, this.student)
      .subscribe(resp => {
        this.ShowResponse(resp);
        this.modalReference.close();
      });
    this.modalReference.close();
  }
  onChangeCourse(event) {
    alert('sasa');
    console.log(event);
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
