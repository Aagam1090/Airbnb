import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReviewModalComponent } from './update-review-modal.component';

describe('UpdateReviewModalComponent', () => {
  let component: UpdateReviewModalComponent;
  let fixture: ComponentFixture<UpdateReviewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateReviewModalComponent]
    });
    fixture = TestBed.createComponent(UpdateReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
