import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursefeeComponent } from './coursefee.component';

describe('CoursefeeComponent', () => {
  let component: CoursefeeComponent;
  let fixture: ComponentFixture<CoursefeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursefeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursefeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
