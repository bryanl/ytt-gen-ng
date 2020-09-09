import { createReducer, on } from '@ngrx/store';

import * as HomeActions from './home.actions';
import { HomeState } from './home.state';

export const initialState: HomeState = {
  currentDescriptor: null,
  descriptors: [],
  source: null,
};

export const homeReducer = createReducer<HomeState>(
  initialState,
  on(
    HomeActions.selectDocumentDescriptor,
    (state, action): HomeState => {
      return {
        ...state,
        currentDescriptor: action.descriptor,
      };
    }
  ),
  on(
    HomeActions.setDocumentDescriptors,
    (state, action): HomeState => {
      return {
        ...state,
        descriptors: action.descriptors,
      };
    }
  ),
  on(
    HomeActions.loadSourceSuccess,
    (state, action): HomeState => {
      return {
        ...state,
        source: action.source,
      };
    }
  )
);
