// This module provides some useful stuff
//
export function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

export class hexColor {
  constructor(obj) {
    this.obj = obj;
  }
  get value() {
    return `#${this.obj['color'].getHexString()}`;
  }
  set value(hexS) {
    this.obj['color'].set(hexS);
  }
}
