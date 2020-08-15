import { KubernetesObject } from './kubernetes-object';
import { Schema } from '../schema/schema';

describe('KubernetesObject', () => {
  let schema: Schema;

  beforeAll(() => {});

  describe('non-core', () => {
    let ko: KubernetesObject;

    beforeEach(() => {
      ko = new KubernetesObject(deployment, schema);
    });
    it('returns the definition id', () => {
      expect(ko.definitionId()).toEqual('io.k8s.api.apps.v1.Deployment');
    });
    it('returns the gvk', () => {
      expect(ko.groupVersionKind()).toEqual({
        group: 'apps',
        version: 'v1',
        kind: 'Deployment',
      });
    });
  });

  describe('core', () => {
    let ko: KubernetesObject;

    beforeEach(() => {
      ko = new KubernetesObject(service, schema);
    });

    it('returns the definition id', () => {
      expect(ko.definitionId()).toEqual('io.k8s.api.core.v1.Service');
    });

    it('returns the gvk', () => {
      expect(ko.groupVersionKind()).toEqual({
        group: '',
        version: 'v1',
        kind: 'Service',
      });
    });
  });
});

const deployment = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
`;

const service = `
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
`;
