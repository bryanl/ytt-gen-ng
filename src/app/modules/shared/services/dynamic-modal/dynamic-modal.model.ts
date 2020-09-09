import { Subject } from 'rxjs';

export interface ModalAction {
  name: string;
  sendData?: boolean;
  isSecondary?: boolean;
  severity?: boolean;
  isDisabled?: boolean;
}

export interface DynamicModal {
  destroy$: Subject<unknown>;
  open?: boolean;
  text?: string;
  actions?: ModalAction[];
  size?: string;
}
