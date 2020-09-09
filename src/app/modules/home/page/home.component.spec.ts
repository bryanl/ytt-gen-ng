import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { ValueViewerComponent } from '@home/page/value-viewer/value-viewer.component';
import { WorkbenchComponent } from '@home/page/workbench/workbench.component';
import { initialState } from '@home/state/home.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { EditorComponent } from 'ngx-monaco-editor';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        ValueViewerComponent,
        EditorComponent,
        WorkbenchComponent,
      ],
      imports: [ClarityModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
