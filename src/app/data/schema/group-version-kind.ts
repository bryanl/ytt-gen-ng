export interface IGroupVersionKind {
  readonly group: string;
  readonly version: string;
  readonly kind: string;
}

export interface GroupVersion {
  group: string;
  version: string;
}

export class GroupVersionKind implements IGroupVersionKind {
  readonly group: string;
  readonly version: string;
  readonly kind: string;

  constructor(options: {
    group?: string;
    version?: string;
    groupVersion?: GroupVersion;
    kind: string;
  }) {
    if (options.groupVersion) {
      this.group = options.groupVersion.group;
      this.version = options.groupVersion.version;
    } else {
      this.group = options.group || '';
      this.version = options.version;
    }

    this.kind = options.kind;
  }
}

export const apiVersion = (gvk: IGroupVersionKind): string => {
  if (!gvk.group || gvk.group === '') {
    return gvk.version;
  }

  return [gvk.group, gvk.version].join('/');
};
