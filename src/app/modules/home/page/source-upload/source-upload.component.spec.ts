import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { SourceUploadComponent } from './source-upload.component';

describe('SourceUploadComponent', () => {
  let component: SourceUploadComponent;
  let fixture: ComponentFixture<SourceUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SourceUploadComponent],
      imports: [ClarityModule, ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
