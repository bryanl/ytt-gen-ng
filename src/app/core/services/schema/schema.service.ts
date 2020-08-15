import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { JsonSchemaService } from '../../../data/service/json-schema/json-schema.service';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private schema: string;
  private schema$: AsyncSubject<string> = new AsyncSubject<string>();

  constructor(private jsonSchemaService: JsonSchemaService) {
    this.jsonSchemaService.load().subscribe((schema) => {
      this.schema = schema;
      this.schema$.next(schema);
      this.schema$.complete();
    });
  }

  getSchema(): Observable<any> {
    return this.schema$.asObservable();
  }
}
