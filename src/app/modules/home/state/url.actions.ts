import { createAction, props } from '@ngrx/store';

export const openDialog = createAction('[URL] Open Dialog');

export const closeDialog = createAction('[URL] Close Dialog');

export const downloadSource = createAction(
  '[URL] Download',
  props<{ url: string }>()
);

export const downloadSuccess = createAction(
  '[URL] Download Success',
  props<{ source: string }>()
);
export const downloadFail = createAction(
  '[URL] Download Fail',
  props<{ error: string }>()
);
