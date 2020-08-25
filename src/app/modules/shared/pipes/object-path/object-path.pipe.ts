import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectPath',
})
export class ObjectPathPipe implements PipeTransform {
  transform(value: string[], ...args: unknown[]): unknown {
    return value.join('.');
  }
}
