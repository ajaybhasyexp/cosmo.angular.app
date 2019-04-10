import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// models
import { Student } from '../../models/student';
import { StudentAssignment } from '../../models/studentAssignment';
import { Branch } from '../../models/branch';
import { Course } from '../../models/course';
import { Batch } from '../../models/batch';
import { CourseFee } from '../../models/coursefee';
import { Profession } from '../../models/profession';
import { Qualification } from '../../models/qualification';
import { Source } from '../../models/source';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  loading: boolean;
  url: string;
  deleteobject: any;
  modalReference: NgbModalRef;
  auth: AuthService;

  branch = new Branch();
  course = new Course();
  student = new Student();
  batch = new Batch();
  courseFee = new CourseFee();
  studentAssignment = new StudentAssignment();
  profession = new Profession();
  qualification = new Qualification();
  source = new Source();

  courses: Array<Course> = new Array<Course>();
  batchs: Array<Batch> = new Array<Batch>();
  students: Array<Student> = new Array<Student>();
  courseFees: Array<CourseFee> = new Array<CourseFee>();
  professions: Array<Profession> = new Array<Profession>();
  qualifications: Array<Qualification> = new Array<Qualification>();
  sources: Array<Source> = new Array<Source>();
  studentAssignments: Array<StudentAssignment> = new Array<StudentAssignment>();

  studentForm = new FormGroup({
    studentName: new FormControl('', Validators.required),
    studentEmail: new FormControl('', [Validators.required, Validators.email]),
    studentContactNo: new FormControl('', Validators.required),
    studentAddress: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required)

  });

  studentDetailsForm = new FormGroup({
    studentQualification: new FormControl(null, Validators.required),
    studentProfession: new FormControl(null, Validators.required),
    studentSourceId: new FormControl(null, Validators.required)
  });
  studentAssignmentForm = new FormGroup({
    studentId: new FormControl(null, Validators.required),
    courseId: new FormControl(0, Validators.required),
    batchId: new FormControl(null, Validators.required),
    courseFeeId: new FormControl(null, Validators.required)
  });

  public btnSubmited = false;
  public btnEnrolmentSubmited = false;
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
    this.loading = true;
    this.GetStudent();
    this.GetStudentAssignments();
    this.GetAssignedCourse();
    this.GetProfession();
    this.GetSource();
    this.GetQualifications();
  }

  GetStudentAssignments() {
    this.loading = true;
    this.service.get(Constants.studentAssign.replace('branchId', this.auth.getBranchId())).subscribe(resp => {
      this.BindStudentAssignments(resp.data);
      this.loading = false;
    });
  }
  BindStudentAssignments(data: Array<StudentAssignment>) {
    console.log(data);
    this.studentAssignments = data;
  }
  GetSource() {
    this.loading = true;
    this.service.get(Constants.sources).subscribe(resp => {
      this.BindSource(resp.data);
      this.loading = false;
    });
  }

  BindSource(data: Array<Source>) {
    this.sources = data;
  }
  GetQualifications() {
    this.service.get(Constants.qualifications).subscribe(resp => {
      this.BindQualifications(resp.data);
      this.loading = false;
    });
  }

  BindQualifications(data: Array<Qualification>) {
    this.qualifications = data;
  }

  GetProfession() {
    this.loading = true;
    this.service.get(Constants.professions).subscribe(resp => {
      this.BindProfession(resp.data);
      this.loading = false;
    });
  }

  BindProfession(data: Array<Profession>) {
    this.professions = data;
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

  onStudentModalClick(content: any, type: number, id: number) {
    this.studentForm.reset();
    this.studentDetailsForm.reset();
    this.student.id = 0;
    if (type === 2) {
      this.loading = true;
      this.service.get(Constants.studentPost + '/' + id).subscribe(resp => {
        this.BindStudent(resp.data);
        this.student = resp.data;
        this.loading = false;
      });
    }

    this.modalReference = this.modalService.open(content, { size: 'lg' });
  }
  BindStudent(data: Student) {
    this.studentForm.setValue({
      studentName: data.studentName,
      studentEmail: data.email,
      studentContactNo: data.contactNumber,
      studentAddress: data.address,
      gender: data.gender,

    });

    this.studentDetailsForm.setValue({
      studentQualification: data.qualificationId,
      studentProfession: data.professionId,
      studentSourceId: data.sourceId,


    });

  }

  onStep1Next(data) {
    this.btnSubmited = true;
    if (this.studentForm.valid) {
      this.btnSubmited = false;
    }
  }

  SaveStudentDetails(data) {

    const userId = +this.auth.getUserId();
    if (this.studentForm.valid) {
      this.student.studentName = this.studentForm.get('studentName').value;
      this.student.email = this.studentForm.get('studentEmail').value;
      this.student.contactNumber = this.studentForm.get('studentContactNo').value;
      this.student.address = this.studentForm.get('studentAddress').value;
      this.student.qualificationId = this.studentDetailsForm.get('studentQualification').value;
      this.student.professionId = this.studentDetailsForm.get('studentProfession').value;
      this.student.sourceId = this.studentDetailsForm.get('studentSourceId').value;
      this.student.createdBy = userId;
      this.student.updatedBy = userId;
      this.student.branchId = this.auth.getBranchId();
      this.student.gender = this.studentForm.get('gender').value;
      this.loading = true;
      this.service.post(Constants.studentPost, this.student)
        .subscribe(resp => {
          this.ShowResponse(resp);
          this.GetStudent();
        });
      this.modalReference.close();
    }
  }

  SaveEnrolmentDetails() {
    this.btnEnrolmentSubmited = true;
    const userId = +this.auth.getUserId();
    if (this.studentAssignmentForm.valid) {
      this.studentAssignment.studentId = this.studentAssignmentForm.get('studentId').value;
      this.studentAssignment.courseId = this.studentAssignmentForm.get('courseId').value;
      this.studentAssignment.batchId = this.studentAssignmentForm.get('batchId').value;
      this.studentAssignment.courseFeeId = this.studentAssignmentForm.get('courseFeeId').value;
      this.studentAssignment.createdBy = userId;
      this.studentAssignment.updatedBy = userId;
      this.studentAssignment.branchId = this.auth.getBranchId();
      this.loading = true;
      this.service.post(Constants.studentAssignSave, this.studentAssignment)
        .subscribe(resp => {
          this.ShowResponse(resp);
          this.GetStudentAssignments();
        });
      this.modalReference.close();
      this.btnEnrolmentSubmited = false;
    }
  }
  onChangeCourse(event) {
    this.GetAssignedbatchs(event);
    this.GetAssignedCourseFee(event);
  }
  GetAssignedbatchs(courseId) {
    this.loading = true;
    this.service.get('batch/' + this.auth.getBranchId() + '/assigned/' + courseId).subscribe(resp => {
      this.loading = false;
      this.BindAssignedBatchs(resp.data);
    });
  }
  GetAssignedCourseFee(courseId) {
    this.loading = true;
    this.service.get('courseFee/' + this.auth.getBranchId() + '/course/' + courseId).subscribe(resp => {
      this.loading = false;
      this.BindAssignedCourseFee(resp.data);
    });
  }
  GetAssignedCourse(): any {
    this.loading = true;
    this.service.get(Constants.assignedcourse.replace('id', this.auth.getBranchId())).subscribe(resp => {
      this.loading = false;
      this.BindAssignedCourses(resp.data);

    });
  }
  onStudentAssignmentModalClick(content, type: number, id: number) {
    this.studentAssignmentForm.reset();
    this.studentAssignmentForm.controls.courseId.setValue('0');
    this.modalReference = this.modalService.open(content);

  }
  BindAssignedCourses(data: Array<Course>) {
    this.courses = data;
  }
  BindAssignedBatchs(data: Array<Batch>) {
    this.batchs = data;
  }
  BindAssignedCourseFee(data: Array<CourseFee>) {
    this.courseFees = data;
  }

  DeleteDetails(id: number, url: string, type: number) {
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
        if (type === 1) {
          this.student.id = id;
          this.deleteobject = this.student;
        } else if (type === 2) {
          this.studentAssignment.id = id;
          this.deleteobject = this.studentAssignment;
        }

        this.url = url;
        this.deleteItem(type);
      }
    });

  }
  deleteItem(type: number) {
    this.service.delete(this.url, this.deleteobject).subscribe(resp => {
      if (resp.isSuccess === true) {
        Swal.fire(
          'Deleted Successfully!!',
          '',
          'success'
        );
        if (type === 1) {
          this.GetStudent();
        } else if (type === 2) {
          this.GetStudentAssignments();
        }

      } else {
        Swal.fire(
          'Deletion Failed!!',
          '',
          'error'
        );
      }


    });
  }
  ShowResponse(response: any) {
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
