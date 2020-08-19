import { Pipe, PipeTransform } from '@angular/core';
import {
  apiVersion,
  IGroupVersionKind,
} from './data/schema/group-version-kind';

@Pipe({
  name: 'apiVersion',
})
export class ApiVersionPipe implements PipeTransform {
  transform(value: IGroupVersionKind, ...args: unknown[]): unknown {
    return apiVersion(value) + ` ${value.kind}`;
  }
}
