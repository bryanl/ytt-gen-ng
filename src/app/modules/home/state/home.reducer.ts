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
};

const getHomeFeatureState = createFeatureSelector<HomeState>(homeFeatureName);

export const getCurrentDescriptor = createSelector(
  getHomeFeatureState,
  (state) => state.currentDescriptor
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
  )
);
