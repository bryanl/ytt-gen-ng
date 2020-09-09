import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';

import { SourceService } from '@data/service/source/source.service';
import * as HomeActions from './home.actions';

@Injectable({
  providedIn: 'root',
})
export class HomeEffects {
  loadSource$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.loadSource),
      mergeMap(() =>
        this.sourceService
          .current()
          .pipe(map((source) => HomeActions.loadSourceSuccess({ source })))
      )
    );
  });

  saveSource$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.saveSource),
      exhaustMap((action) => {
        this.sourceService.set(action.source);
        return of(HomeActions.loadSource());
      })
    );
  });

  constructor(
    private actions$: Actions,
    private sourceService: SourceService
  ) {}
}
