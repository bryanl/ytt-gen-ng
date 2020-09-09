import { DocumentDescriptor } from '@data/schema/document-descriptor';
import { createAction, props } from '@ngrx/store';

export const loadSource = createAction('[Home] Load Source');

export const loadSourceSuccess = createAction(
  '[Home] Source Loaded Successful',
  props<{ source: string }>()
);

export const saveSource = createAction(
  '[Home] Save Source',
  props<{ source: string }>()
);

export const selectDocumentDescriptor = createAction(
  '[Sidebar] Select Document Descriptor',
  props<{ descriptor: DocumentDescriptor }>()
);

export const setDocumentDescriptors = createAction(
  '[Home] Set Document Descriptors',
  props<{ descriptors: DocumentDescriptor[] }>()
);

export const downloadSource = createAction('[Home] Download Source');
