import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { initialState } from '@home/state/home.reducer';
import { UrlEffects } from '@home/state/url.effects';
import { UrlService } from '@home/url.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicModalService } from '@shared/services/dynamic-modal/dynamic-modal.service';
import { Observable, of, throwError } from 'rxjs';

import * as HomeActions from './home.actions';
import * as UrlActions from './url.actions';

describe('UrlEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: UrlEffects;
  let urlService: jasmine.SpyObj<UrlService>;
  let dynamicModal: jasmine.SpyObj<DynamicModalService>;

  beforeEach(async(() => {
    urlService = jasmine.createSpyObj('UrlService', ['download']);
    dynamicModal = jasmine.createSpyObj('DynamicModalService', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UrlEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: UrlService, useValue: urlService },
        { provide: DynamicModalService, useValue: dynamicModal },
      ],
    });

    effects = TestBed.inject<UrlEffects>(UrlEffects);
  }));

  describe('openDialog', () => {
    const sourceURL = 'http://example.com';

    it('dispatches UrlActions.closeDialog when it returns a null', () => {
      dynamicModal.open.and.returnValue(of(null));
      actions$ = of(UrlActions.openDialog());

      effects.openDialog$.subscribe((action) => {
        expect(action).toEqual(UrlActions.closeDialog());
      });
    });
    it('dispatches UrlActions.downloadSource', () => {
      dynamicModal.open.and.returnValue(of({ sourceURL }));
      actions$ = of(UrlActions.openDialog());

      effects.openDialog$.subscribe((action) => {
        expect(action).toEqual(UrlActions.downloadSource({ url: sourceURL }));
      });
    });
  });

  describe('download', () => {
    const url = 'http://example.com';
    const source = 'source';

    it('dispatches Home.saveSource', () => {
      urlService.download.withArgs(url).and.returnValue(of(source));
      actions$ = of(UrlActions.downloadSource({ url }));

      effects.download$.subscribe((action) => {
        expect(action).toEqual(HomeActions.saveSource({ source }));
      });
    });

    it('dispatches Home.downloadFail when there is an error', () => {
      const error = new Error('error');
      urlService.download.withArgs(url).and.returnValue(throwError(error));

      actions$ = of(UrlActions.downloadSource({ url }));

      effects.download$.subscribe((action) => {
        expect(action).toEqual(UrlActions.downloadFail({ error: 'error' }));
      });
    });
  });
});
