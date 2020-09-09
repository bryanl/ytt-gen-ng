import { DocumentDescriptor } from '@data/schema/document-descriptor';
import { homeReducer, initialState } from '@home/state/home.reducer';
import { HomeState } from '@home/state/home.state';

import * as HomeActions from './home.actions';

describe('homeReducer', () => {
  const descriptor: DocumentDescriptor = {
    id: 'id',
    sourceLocator: {
      apiVersion: 'apiVersion',
      kind: 'kind',
      name: 'name',
    },
    value: 'value',
  };
  const source = 'source';

  describe('HomeActions.selectDocumentDescriptor', () => {
    it('selects the current descriptor', () => {
      const state = initialState;
      const action = HomeActions.selectDocumentDescriptor({ descriptor });
      const expected: HomeState = {
        ...initialState,
        ...{ currentDescriptor: descriptor },
      };

      expect(homeReducer(state, action)).toEqual(expected);
    });
  });

  describe('HomeActions.setDocumentDescriptors', () => {
    it('sets descriptors', () => {
      const state = initialState;
      const action = HomeActions.setDocumentDescriptors({
        descriptors: [descriptor],
      });
      const expected: HomeState = {
        ...initialState,
        ...{ descriptors: [descriptor] },
      };

      expect(homeReducer(state, action)).toEqual(expected);
    });
  });

  describe('HomeActions.loadSourceSuccess', () => {
    it('sets source', () => {
      const state = initialState;
      const action = HomeActions.loadSourceSuccess({
        source,
      });
      const expected: HomeState = {
        ...initialState,
        ...{ source },
      };

      expect(homeReducer(state, action)).toEqual(expected);
    });
  });
});
