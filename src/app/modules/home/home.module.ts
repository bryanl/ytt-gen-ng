import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home.component';
import { HomeRoutingModule } from './home.routing';
import { ClarityModule } from '@clr/angular';
import { UploadModalComponent } from './page/upload-modal/upload-modal.component';
import { YttEditorComponent } from './page/ytt-editor/ytt-editor.component';
import { ValueModalComponent } from './page/value-modal/value-modal.component';
import { SharedModule } from '../shared/shared.module';
import { WorkbenchComponent } from './page/workbench/workbench.component';
import { SidebarComponent } from './page/sidebar/sidebar.component';
import { ValueViewerComponent } from './page/value-viewer/value-viewer.component';
import { CreateValueFormComponent } from './page/create-value-form/create-value-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [
    CreateValueFormComponent,
    HomeComponent,
    SidebarComponent,
    UploadModalComponent,
    ValueModalComponent,
    ValueViewerComponent,
    WorkbenchComponent,
    YttEditorComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    SharedModule,
    MonacoEditorModule,
    ReactiveFormsModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
