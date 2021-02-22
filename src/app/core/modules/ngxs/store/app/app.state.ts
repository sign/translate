import {Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {DisplayError, ResetError, StartLoading, StopLoading} from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  error: string;
}

const initialState: AppStateModel = {
  isLoading: false,
  error: null
};

@Injectable()
@State<AppStateModel>({
  name: 'app',
  defaults: initialState
})
export class AppState {
  @Action(StartLoading)
  startLoading({patchState}: StateContext<AppStateModel>): void {
    patchState({isLoading: true});
  }

  @Action(StopLoading)
  stopLoading({patchState}: StateContext<AppStateModel>): void {
    patchState({isLoading: false});
  }

  @Action(DisplayError)
  displayError({patchState}: StateContext<AppStateModel>, {message}: DisplayError): void {
    patchState({error: message});
  }

  @Action(ResetError)
  resetError({patchState}: StateContext<AppStateModel>): void {
    patchState({error: null});
  }
}
