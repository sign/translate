export class SetSetting {
  static readonly type = '[Settings] Set Setting';

  constructor(public setting: string, public value: any) {
  }
}
