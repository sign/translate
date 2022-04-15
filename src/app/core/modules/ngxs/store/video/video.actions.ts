export class StartCamera {
  static readonly type = '[Video] Start Camera';
}

export class SetVideo {
  static readonly type = '[Video] Set Video';

  constructor(public src: string) {}
}

export class StopVideo {
  static readonly type = '[Video] Stop Video';
}
