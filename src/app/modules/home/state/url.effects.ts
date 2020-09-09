import { Injectable } from '@angular/core';
import { SourceUploadComponent } from '@home/page/source-upload/source-upload.component';
import { State } from '@home/state/home.state';
import { UrlService } from '@home/url.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DynamicModalService } from '@shared/services/dynamic-modal/dynamic-modal.service';
import { of } from 'rxjs';
import { catchError, flatMap, map, mergeMap } from 'rxjs/operators';
import * as HomeActions from './home.actions';
import * as UrlActions from './url.actions';

@Injectable()
export class UrlEffects {
  openDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UrlActions.openDialog),
      flatMap(() => {
        return this.dynamicModal.open({
          component: SourceUploadComponent,
        });
      }),
      map((result) => {
        if (result === null) {
          return UrlActions.closeDialog();
        }

        return UrlActions.downloadSource({ url: result.sourceURL });
      })
    );
  });

  download$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UrlActions.downloadSource),
      mergeMap(({ url }) =>
        this.urlService.download(url).pipe(
          map((source) => HomeActions.saveSource({ source })),
          catchError((error: Error) =>
            of(UrlActions.downloadFail({ error: error.message }))
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dynamicModal: DynamicModalService,
    private urlService: UrlService
  ) {}
}
