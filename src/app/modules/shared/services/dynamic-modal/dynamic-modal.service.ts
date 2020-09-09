import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { DynamicModal } from './dynamic-modal.model';

export interface OpenOptions {
  component: Type<DynamicModal>;
}

@Injectable({
  providedIn: 'root',
})
export class DynamicModalService {
  private viewContainerRef: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {}

  setViewContainerRef(vcr: ViewContainerRef) {
    this.viewContainerRef = vcr;
  }

  open(options: OpenOptions): Observable<any> {
    const injector: Injector = Injector.create({
      providers: [
        {
          provide: 'foo',
          useValue: {
            value: 'bar',
          },
        },
      ],
    });

    const factory = this.cfr.resolveComponentFactory(options.component);
    const componentRef = this.viewContainerRef.createComponent(
      factory,
      0,
      injector
    );

    componentRef.instance.open = true;

    setTimeout(() => this.viewContainerRef.insert(componentRef.hostView));

    console.log('component ref', componentRef);

    return (componentRef.instance as DynamicModal).destroy$.asObservable().pipe(
      take(1),
      tap(() => componentRef.destroy())
    );
  }
}
