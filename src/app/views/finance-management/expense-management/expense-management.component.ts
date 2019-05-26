import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../../constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense-management',
  templateUrl: './expense-management.component.html',
  styleUrls: ['./expense-management.component.scss']
})
export class ExpenseManagementComponent implements OnInit {
  loading: boolean;
 
  public btnExpenseSubmited = false;

  expenseAddForm = new FormGroup({
    expenseHeadCtrl: new FormControl(null, Validators.required),
    descriptionCtrl: new FormControl(null, Validators.required),
    expenseHeadPaymentMode: new FormControl(null, Validators.required),
    expenseHeadDate: new FormControl(null, Validators.required),
    referenceCtrl: new FormControl(null, Validators.required),
    amountCtrl: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(5),
    ]),
    
  });
  constructor(public auth: AuthService, private service: ApiService) { }

  ngOnInit() {
  }
  saveIncome()
  {
    this.btnExpenseSubmited=true;
    if (this.expenseAddForm.valid){
    /*  this.expenseDetails.description = this.expenseAddForm.get('descriptionCtrl').value;
      this.expenseDetails.incomeHeadId = this.expenseAddForm.get('incomeHeadCtrl').value;
      //this.incomeDetails.paymentModeId = this.expenseAddForm.get('expenseHeadPaymentMode').value;
      //this.incomeDetails.transDate = this.incomeAddForm.get('expenseHeadDate').value;
      this.expenseDetails.reference = this.expenseAddForm.get('referenceCtrl').value;
      this.expenseDetails.amount = this.expenseAddForm.get('amountCtrl').value;
      const userId = +this.auth.getUserId();
      this.expenseDetails.createdBy = userId;
      this.expenseDetails.updatedBy = userId;
      this.expenseDetails.branchId=this.auth.getBranchId();
      console.log(this.expenseDetails); return false;
      this.loading = true;
      this.service.post(Constants.income, this.expenseDetails).subscribe(resp => {
      console.log(resp);
        this.expenseAddForm.reset();
        this.ShowResponse(resp);
      });
      this.btnExpenseSubmited=false;*/
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
