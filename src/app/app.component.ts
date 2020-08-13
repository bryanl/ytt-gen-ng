import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ytt-gen-ng';

  code = 'foo: bar\n---\nfoo: bar\n';
}
