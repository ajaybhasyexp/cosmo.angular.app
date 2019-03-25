import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchassignComponent } from './batchassign.component';

describe('BatchassignComponent', () => {
  let component: BatchassignComponent;
  let fixture: ComponentFixture<BatchassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
