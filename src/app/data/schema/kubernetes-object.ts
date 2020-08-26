import * as YAML from 'yaml';
import { ISchema } from '../../core/services/schema/schema';
import {
  GroupVersion,
  GroupVersionKind,
  IGroupVersionKind,
} from './group-version-kind';

export class KubernetesObject {
  private parsed: any;

  constructor(private source: string, private schema: ISchema) {
    this.parsed = YAML.parse(source);
  }

  groupVersionKind(): IGroupVersionKind {
    return new GroupVersionKind({
      groupVersion: this.groupVersion(),
      kind: this.parsed.kind,
    });
  }

  name(): string {
    return this.parsed.metadata.name;
  }

  definitionId(): string {
    const gvk = this.groupVersionKind();

    const group = gvk.group.length === 0 ? 'core' : gvk.group;

    return `io.k8s.api.${group}.${gvk.version}.${gvk.kind}`;
  }

  description(...path: string[]): string {
    return this.schema.description(this.definitionId(), path);
  }

  type(...path: string[]): string[] {
    return this.schema.type(this.definitionId(), path);
  }

  private groupVersion(): GroupVersion {
    if (!this.parsed.apiVersion) {
      return undefined;
    }
    const apiVersion = this.parsed.apiVersion as string;
    const parts = apiVersion.split('/');
    if (parts.length === 1) {
      return {
        group: '',
        version: parts[0],
      };
    }

    return {
      group: parts[0],
      version: parts[1],
    };
  }
}
