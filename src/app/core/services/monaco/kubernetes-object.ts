import * as YAML from 'yaml';
import { ISchema } from '../schema/schema';

export interface GroupVersionKind {
  group: string;
  version: string;
  kind: string;
}

interface GroupVersion {
  group: string;
  version: string;
}

export class KubernetesObject {
  private parsed: any;

  constructor(private source: string, private schema: ISchema) {
    this.parsed = YAML.parse(source);
  }

  groupVersionKind(): GroupVersionKind {
    const groupVersion = this.groupVersion();
    return {
      ...groupVersion,
      kind: this.parsed.kind,
    };
  }

  definitionId(): string {
    const gvk = this.groupVersionKind();

    const group = gvk.group.length === 0 ? 'core' : gvk.group;

    return `io.k8s.api.${group}.${gvk.version}.${gvk.kind}`;
  }

  description(...path: string[]): string {
    return this.schema.description(this.definitionId(), path);
  }

  private groupVersion(): GroupVersion {
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
