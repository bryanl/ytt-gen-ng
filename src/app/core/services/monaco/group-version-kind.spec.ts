import { apiVersion, GroupVersionKind } from './group-version-kind';

describe('GroupVersionKind', () => {
  describe('apiVersion', () => {
    it('create apiVersion when there is no group', () => {
      const gvk = new GroupVersionKind({ version: 'v1', kind: 'Service' });
      expect(apiVersion(gvk)).toEqual('v1');
    });
  });
});
