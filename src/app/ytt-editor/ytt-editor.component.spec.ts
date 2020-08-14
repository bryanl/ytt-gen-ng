import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YttEditorComponent } from './ytt-editor.component';

describe('YttEditorComponent', () => {
  let component: YttEditorComponent;
  let fixture: ComponentFixture<YttEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YttEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YttEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
