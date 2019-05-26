import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../../constants';
import { IncomeHead } from '../../../models/incomehead';

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
    referenceCtrl: new FormControl(null),
    amountCtrl: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(5),
    ]),
  });

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

}
