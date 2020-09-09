import { Injectable } from '@angular/core';
import { Field } from '@data/schema/field';
import { KubernetesObject } from '@data/schema/kubernetes-object';
import { YamlDocument } from '@data/schema/yaml-document';
import { Observable } from 'rxjs';
import * as YAML from 'yaml';
import { SchemaService } from '../schema/schema.service';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Injectable({
  providedIn: 'root',
})
export class ExtractService {
  constructor(private schemaService: SchemaService) {}

  onKeySelected(editor: IStandaloneCodeEditor) {
    return new Observable<Field>((observer) => {
      this.schemaService.current().subscribe((schema) => {
        const doc = new YamlDocument(editor.getValue());

        const resolveObject = (object: any, path: string[]): any => {
          if (path.length === 0) {
            return object;
          }
          const key = path.shift();
          return resolveObject(object[key], path);
        };

        editor.onMouseDown((e) => {
          switch (e.target.type) {
            case monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN:
              const value = doc.lineValue(e.target.position.lineNumber);
              const object = YAML.parse(editor.getValue());

              observer.next({
                kubernetesObject: new KubernetesObject(doc.source, schema),
                value,
                object: resolveObject(object, [...value.path]),
              });
              break;
          }
        });
      });
    });
  }
}
