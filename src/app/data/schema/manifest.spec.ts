import { Manifest } from './manifest';

fdescribe('Manifest', () => {
  let source: string;
  let manifest: Manifest;

  describe('docDescriptors', () => {
    describe('non kubernetes source', () => {
      beforeEach(() => {
        source = docs.invalid;
        manifest = new Manifest(source);
      });

      it('throws an exception', () => {
        manifest = new Manifest(source);
        expect(() => manifest.docDescriptors()).toThrow();
      });
    });

    describe('simple source', () => {
      beforeEach(() => {
        source = docs.simple;
        manifest = new Manifest(source);
      });

      it('returns doc descriptors', () => {
        const got = manifest.docDescriptors();
        expect(got.length).toEqual(3);
      });
    });
  });
});

const docs = {
  invalid: `foo:bar`,
  simple: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: greeter
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: greeter
  replicas: 1
  template:
    metadata:
      labels:
        app.kubernetes.io/name: greeter
    spec:
      containers:
        - name: webserver
          image: gcr.io/cf-k8s-lifecycle-tooling-klt/starter@sha256:bbf0c1fb9b64fc0042588feae6e789ad8d9beda6d65839f522974c40fe4353b3
          env:
            - name: GREETING
              valueFrom:
                configMapKeyRef:
                  name: greeter
                  key: greeting
---
apiVersion: v1
kind: Service
metadata:
  name: greeter
spec:
  selector:
    app.kubernetes.io/name: greeter
  ports:
    - port: 8080
      targetPort: 80
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: greeter
data:
  greeting: Hello`,
};
