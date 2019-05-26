import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeManagementComponent } from './income-management.component';

describe('IncomeManagementComponent', () => {
  let component: IncomeManagementComponent;
  let fixture: ComponentFixture<IncomeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
