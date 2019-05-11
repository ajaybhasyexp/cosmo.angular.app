import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseMastersComponent } from './expense-masters.component';

describe('ExpenseMastersComponent', () => {
  let component: ExpenseMastersComponent;
  let fixture: ComponentFixture<ExpenseMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
