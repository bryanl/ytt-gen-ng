import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { UrlEffects } from '@home/state/url.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { HomeRoutingModule } from './home.routing';
import { ChooseValueFormComponent } from './page/choose-value-form/choose-value-form.component';
import { CreateValueFormComponent } from './page/create-value-form/create-value-form.component';
import { HomeComponent } from './page/home.component';
import { SidebarComponent } from './page/sidebar/sidebar.component';
import { SourceUploadComponent } from './page/source-upload/source-upload.component';
import { UploadModalComponent } from './page/upload-modal/upload-modal.component';
import { ValueModalComponent } from './page/value-modal/value-modal.component';
import { ValueViewerComponent } from './page/value-viewer/value-viewer.component';
import { WorkbenchComponent } from './page/workbench/workbench.component';
import { YttEditorComponent } from './page/ytt-editor/ytt-editor.component';
import { HomeEffects } from './state/home.effects';
import { homeReducer } from './state/home.reducer';

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
    ChooseValueFormComponent,
    SourceUploadComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    SharedModule,
    MonacoEditorModule,
    ReactiveFormsModule,
    StoreModule.forFeature('home', homeReducer),
    EffectsModule.forFeature([HomeEffects, UrlEffects]),
    HomeRoutingModule,
  ],
})
export class HomeModule {}
