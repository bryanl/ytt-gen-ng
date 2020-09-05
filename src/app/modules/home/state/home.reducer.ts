import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';

import * as HomeActions from './home.actions';
import { HomeState } from './home.state';

export const homeFeatureName = 'home';

const initialState: HomeState = {
  currentDescriptor: null,
  descriptors: [],
};

const getHomeFeatureState = createFeatureSelector<HomeState>(homeFeatureName);

export const getCurrentDescriptor = createSelector(
  getHomeFeatureState,
  (state) => state.currentDescriptor
);

export const getDescriptors = createSelector(
  getHomeFeatureState,
  (state) => state.descriptors
);

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
  )
);
