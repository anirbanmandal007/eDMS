import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SftpUploadComponent } from './sftp-upload.component';

describe('SftpUploadComponent', () => {
  let component: SftpUploadComponent;
  let fixture: ComponentFixture<SftpUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SftpUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SftpUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
