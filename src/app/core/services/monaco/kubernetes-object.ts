import * as YAML from 'yaml';

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

  constructor(private source: string) {
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
