import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DynamicModalService } from '@app/modules/shared/services/dynamic-modal/dynamic-modal.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    private vcr: ViewContainerRef,
    private dynamicModalService: DynamicModalService
  ) {}

  ngOnInit() {
    this.dynamicModalService.setViewContainerRef(this.vcr);
  }
}
