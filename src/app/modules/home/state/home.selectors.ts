import { HomeState } from '@home/state/home.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const getHomeFeatureState = createFeatureSelector<HomeState>('home');

export const getCurrentDescriptor = createSelector(
  getHomeFeatureState,
  (state) => (state ? state.currentDescriptor : null)
);
export const getDescriptors = createSelector(getHomeFeatureState, (state) =>
  state ? state.descriptors : null
);
export const getSource = createSelector(getHomeFeatureState, (state) =>
  state ? state.source : null
);
