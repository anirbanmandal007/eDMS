import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfirmationRequiredComponent } from './user-confirmation-required.component';

describe('UserConfirmationRequiredComponent', () => {
  let component: UserConfirmationRequiredComponent;
  let fixture: ComponentFixture<UserConfirmationRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConfirmationRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfirmationRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
