import * as AppState from '@app/state/app.state';
import { DocumentDescriptor } from '@data/schema/document-descriptor';

export interface State extends AppState.State {
  home: HomeState;
}
export interface HomeState {
  currentDescriptor: DocumentDescriptor | null;
  descriptors: DocumentDescriptor[];
  source: string;
}
