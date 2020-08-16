import { Pipe, PipeTransform } from '@angular/core';
import {
  apiVersion,
  IGroupVersionKind,
} from './core/services/monaco/group-version-kind';

@Pipe({
  name: 'apiVersion',
})
export class ApiVersionPipe implements PipeTransform {
  transform(value: IGroupVersionKind, ...args: unknown[]): unknown {
    return apiVersion(value) + ` ${value.kind}`;
  }
}
