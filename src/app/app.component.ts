import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {MatProgressSpinner, MatSpinner} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ResetError} from './core/modules/ngxs/store/app/app.actions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(state => state.app.isLoading) isLoading$: Observable<boolean>;
  @Select(state => state.app.error) error$: Observable<string>;
  @Select(state => state.audio.error) audioError$: Observable<string>;

  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;


  loaderDialog: MatDialogRef<MatProgressSpinner>;

  constructor(private transloco: TranslocoService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store) {
  }

  ngOnInit(): void {
    this.manageLoading();
    this.manageAppErrors();
  }

  manageLoading(): void {
    this.isLoading$.pipe(
      filter(isLoading => isLoading || Boolean(this.loaderDialog)),
      tap(isLoading => {
        if (isLoading) {
          this.loaderDialog = this.dialog.open(MatSpinner, {panelClass: 'app-loader-dialog'});
        } else {
          this.loaderDialog.close();
          delete this.loaderDialog;
        }
      })
    ).subscribe();
  }

  manageAppErrors(): void {
    this.error$.pipe(
      filter(Boolean),
      tap((error: string) => {
        this.store.dispatch(new ResetError());

        this.snackBar.open(error, null, {
          panelClass: 'mat-warn',
          duration: 10000
        });
      })
    ).subscribe();
  }
}
