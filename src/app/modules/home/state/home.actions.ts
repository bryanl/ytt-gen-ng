import { createAction, props } from '@ngrx/store';
import { DocumentDescriptor } from '../../../data/schema/document-descriptor';

export const selectDocumentDescriptor = createAction(
  '[Sidebar] Select Document Descriptor',
  props<{ descriptor: DocumentDescriptor }>()
);
