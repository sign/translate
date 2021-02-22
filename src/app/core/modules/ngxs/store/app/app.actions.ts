export class StartLoading {
  static readonly type = '[App] Start Loading';
}

export class StopLoading {
  static readonly type = '[App] Stop Loading';
}

export class ResetError {
  static readonly type = '[App] Reset Error';
}

export class DisplayError {
  static readonly type = '[App] Display Error';
  static readonly eventParams = ['message'];

  public message: string;

  constructor(public error: any) {
    console.error(error);

    if (error.error && error.error.message) {
      this.message = error.error.message;
    } else if (typeof error.message === 'string') {
      this.message = error.message;
    } else {
      this.message = error;
    }
  }
}
