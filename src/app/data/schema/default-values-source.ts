/**
 * DefaultValuesSource generates the source for a default values file.
 */
export class DefaultValuesSource {
  generate(): string {
    return `@#data/values
---
name: "value"`;
  }
}
