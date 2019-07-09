import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../../constants';
import Swal from 'sweetalert2';
import { ExpenseHead } from '../../../models/expensehead';
import { ExpenseDetails } from '../../../models/expenseDetails';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expense-management',
  templateUrl: './expense-management.component.html',
  styleUrls: ['./expense-management.component.scss']
})
export class ExpenseManagementComponent implements OnInit {
  loading: boolean;

  public btnExpenseSubmited = false;
  expenseDetails: ExpenseDetails = new ExpenseDetails();
  expenseHeads: Array<ExpenseHead> = new Array<ExpenseHead>();

  expenseAddForm = new FormGroup({
    expenseHeadCtrl: new FormControl(null, Validators.required),
    descriptionCtrl: new FormControl(null, Validators.required),
    expenseHeadPaymentMode: new FormControl(null, Validators.required),
    expenseHeadDate: new FormControl(null, Validators.required),
    referenceCtrl: new FormControl(null, Validators.required),
    amountCtrl: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(10),
    ]),

  });
  constructor(public auth: AuthService, private service: ApiService, private parserFormatter: NgbDateParserFormatter) { }

  ngOnInit() {
    this.loadExpenseHead();
  }
  loadExpenseHead() {
    this.loading = true;
    this.service.get(Constants.expenseHead).subscribe(p => {
      this.bindExpenseHeads(p.data);
      this.loading = false;
    });
  }

  bindExpenseHeads(data: Array<ExpenseHead>) {
    this.expenseHeads = data;
  }
  saveExpense() {
    this.btnExpenseSubmited = true;
    if (this.expenseAddForm.valid) {
      this.expenseDetails.description = this.expenseAddForm.get('descriptionCtrl').value;
      this.expenseDetails.expenseHeadId = this.expenseAddForm.get('expenseHeadCtrl').value;
      this.expenseDetails.paymentModeId = this.expenseAddForm.get('expenseHeadPaymentMode').value;
      const date = this.parserFormatter.format(this.expenseAddForm.get('expenseHeadDate').value);
      this.expenseDetails.transDate = date;
      this.expenseDetails.reference = this.expenseAddForm.get('referenceCtrl').value;
      this.expenseDetails.amount = this.expenseAddForm.get('amountCtrl').value;
      const userId = +this.auth.getUserId();
      this.expenseDetails.createdBy = userId;
      this.expenseDetails.updatedBy = userId;
      this.expenseDetails.branchId = this.auth.getBranchId();
      this.loading = true;
      this.service.post(Constants.expense, this.expenseDetails).subscribe(resp => {
        this.expenseAddForm.reset();
        this.ShowResponse(resp);
      });
      this.btnExpenseSubmited = false;
    }
  }
  ResetExpense() {
    this.expenseAddForm.reset();
    this.btnExpenseSubmited = false;
  }
  ShowResponse(response: any) {
    if (response.isSuccess === true) {
      this.loading = false;
      Swal.fire(
        response.message,
        '',
        'success'
      );
      this.expenseAddForm.reset();
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
