import { async, TestBed } from '@angular/core/testing';
import { SourceService } from '@data/service/source/source.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import * as HomeActions from './home.actions';
import { HomeEffects } from './home.effects';

describe('HomeEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: HomeEffects;
  let sourceService: jasmine.SpyObj<SourceService>;

  beforeEach(async(() => {
    sourceService = jasmine.createSpyObj('SourceService', ['current', 'set']);

    TestBed.configureTestingModule({
      providers: [
        HomeEffects,
        provideMockActions(() => actions$),
        provideMockStore({}),
        { provide: SourceService, useValue: sourceService },
      ],
    });

    effects = TestBed.inject<HomeEffects>(HomeEffects);
  }));

  describe('loadSource', () => {
    it('load source and dispatches HomeActions.loadSourceSuccess', () => {
      const source = 'source';
      sourceService.current.and.returnValue(of(source));

      actions$ = of(HomeActions.loadSource());

      effects.loadSource$.subscribe((action) => {
        expect(action).toEqual(HomeActions.loadSourceSuccess({ source }));
      });
    });
  });

  describe('saveSource', () => {
    it('saves source and dispatches HomeActions.loadSource', () => {
      const source = 'source';
      sourceService.set.withArgs(source);

      actions$ = of(HomeActions.saveSource({ source }));

      effects.saveSource$.subscribe((action) => {
        expect(action).toEqual(HomeActions.loadSource());
      });
    });
  });
});
