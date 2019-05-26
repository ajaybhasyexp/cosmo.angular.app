import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../../constants';
import { IncomeHead } from '../../../models/incomehead';
import { IncomeDetails } from '../../../models/incomeDetails';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-income-management',
  templateUrl: './income-management.component.html',
  styleUrls: ['./income-management.component.scss']
})
export class IncomeManagementComponent implements OnInit {

  loading: boolean;
  incomeAddForm = new FormGroup({
    incomeHeadCtrl: new FormControl(null, Validators.required),
    descriptionCtrl: new FormControl(null, Validators.required),
    incomeHeadPaymentMode: new FormControl(null, Validators.required),
    incomeHeadDate: new FormControl(null, Validators.required),
    referenceCtrl: new FormControl(null),
    amountCtrl: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(5),
    ]),
  });
  incomeDetails: IncomeDetails = new IncomeDetails();
  incomeHeads: Array<IncomeHead> = new Array<IncomeHead>();
  constructor(public auth: AuthService, private service: ApiService) { }

  ngOnInit() {
    this.loadIncomeHead();
  }

  loadIncomeHead() {
    this.service.get(Constants.incomehead).subscribe(p => {
      this.bindIncomeHeads(p.data);
    });
  }

  bindIncomeHeads(data: Array<IncomeHead>) {
    console.log(data);
    this.incomeHeads = data;
  }
  ResetIncome()
  {
    this.incomeAddForm.reset(); 
  }
  saveIncome()
  {
    this.incomeDetails.description = this.incomeAddForm.get('descriptionCtrl').value;
    this.incomeDetails.incomeHeadId = this.incomeAddForm.get('incomeHeadCtrl').value;
    this.incomeDetails.paymentModeId = this.incomeAddForm.get('incomeHeadPaymentMode').value;
    this.incomeDetails.transDate = this.incomeAddForm.get('incomeHeadDate').value;
    this.incomeDetails.reference = this.incomeAddForm.get('referenceCtrl').value;
    this.incomeDetails.amount = this.incomeAddForm.get('amountCtrl').value;
    const userId = +this.auth.getUserId();
    this.incomeDetails.createdBy = userId;
    this.incomeDetails.updatedBy = userId;
    this.incomeDetails.branchId=this.auth.getBranchId();
    console.log(this.incomeDetails); return false;
    this.loading = true;
    this.service.post(Constants.incomehead, this.incomeDetails).subscribe(resp => {
     
      this.incomeAddForm.reset();
      this.ShowResponse(resp);
    });
  
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
