import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YttEditorComponent } from './ytt-editor/ytt-editor.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ValueModalComponent } from './value-modal/value-modal.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WorkbenchComponent } from './workbench/workbench.component';

@NgModule({
  declarations: [AppComponent, YttEditorComponent, UploadModalComponent, ValueModalComponent, SidebarComponent, WorkbenchComponent],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // clarity
    ClarityModule,

    // monaco
    MonacoEditorModule.forRoot(),

    // core
    CoreModule,

    // app
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
