import { KubernetesObject } from './kubernetes-object';
import { ValueDescriptor } from './value-descriptor';

export interface Field {
  kubernetesObject: KubernetesObject;
  value: ValueDescriptor;
  object: any;
}
