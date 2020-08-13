import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  @Input() code: string;

  editorOptions = { theme: 'vs-dark', language: 'yaml' };

  constructor() {}
}
