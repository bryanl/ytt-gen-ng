import { DocumentDescriptor } from '@data/schema/document-descriptor';
import { initialState } from '@home/state/home.reducer';
import {
  getCurrentDescriptor,
  getDescriptors,
  getSource,
} from '@home/state/home.selectors';
import { HomeState } from '@home/state/home.state';

describe('selectors', () => {
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

  describe('getCurrentDescriptor', () => {
    it('should return the current descriptor', () => {
      const state: HomeState = {
        ...initialState,
        currentDescriptor: descriptor,
      };

      expect(getCurrentDescriptor.projector(state)).toBe(descriptor);
    });
  });

  describe('getDescriptors', () => {
    it('should return descriptors', () => {
      const state: HomeState = { ...initialState, descriptors: [descriptor] };

      expect(getDescriptors.projector(state)).toEqual([descriptor]);
    });
  });

  describe('getSource', () => {
    it('should return source', () => {
      const state: HomeState = { ...initialState, source };

      expect(getSource.projector(state)).toBe(source);
    });
  });
});
