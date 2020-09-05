import { DocumentDescriptor } from '../../../data/schema/document-descriptor';
import * as AppState from '../../../state/app.state';

export interface State extends AppState.State {
  home: HomeState;
}
export interface HomeState {
  currentDescriptor: DocumentDescriptor | null;
}
