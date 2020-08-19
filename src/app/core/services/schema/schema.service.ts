import { Injectable, NgZone } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { JsonSchemaService } from '../../../data/service/json-schema/json-schema.service';
import { Schema } from './schema';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private schema: Schema;
  private schema$: AsyncSubject<Schema> = new AsyncSubject<Schema>();

  constructor(
    private jsonSchemaService: JsonSchemaService,
    private ngZone: NgZone
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.jsonSchemaService.load().subscribe((data) => {
        this.schema = new Schema(data);
        this.schema$.next(this.schema);
        this.schema$.complete();
      });
    });
  }

  getSchema(): Observable<Schema> {
    return this.schema$.asObservable();
  }

  current(): Observable<Schema> {
    return this.schema$.pipe(
      filter((x) => x !== undefined),
      take(1)
    );
  }
}
