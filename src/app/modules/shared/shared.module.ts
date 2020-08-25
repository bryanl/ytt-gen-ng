import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectPathPipe } from './pipes/object-path/object-path.pipe';
import { ApiVersionPipe } from './pipes/api-version/api-version.pipe';

@NgModule({
  declarations: [ApiVersionPipe, ObjectPathPipe],
  imports: [CommonModule],
  exports: [ApiVersionPipe, ObjectPathPipe],
})
export class SharedModule {}
