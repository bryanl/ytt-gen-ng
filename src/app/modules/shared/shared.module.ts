import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ApiVersionPipe } from './pipes/api-version/api-version.pipe';
import { ObjectPathPipe } from './pipes/object-path/object-path.pipe';

@NgModule({
  declarations: [ApiVersionPipe, ObjectPathPipe],
  imports: [CommonModule, ClarityModule, FormsModule, ReactiveFormsModule],
  exports: [ApiVersionPipe, ObjectPathPipe],
})
export class SharedModule {}
