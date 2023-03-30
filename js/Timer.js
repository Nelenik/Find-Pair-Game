import { Tag, CheckCallback } from "./_helpers.js";


/*options = {
  container,
  min: str,
  onTimeOut: ()=>{}
} */

export class Timer {

  constructor(options) {
    const { container, min, onTimeOut } = options
    this.container = container;
    this.createTimerWrapper();
    this.onTimeOut = CheckCallback.check(onTimeOut);
    this.startTime = min || '1';
    this.isRunning = true;
  }

  createTimerWrapper() {
    this.timerWrapper = Tag.build({
      tagName: 'span',
      classes: ['control-bar__timer'],
    })
    this.container.prepend(this.timerWrapper)
  }

  set startTime(value) {
    this._startTime = parseFloat(value) * 60;
    this.currentTime = this._startTime;
  }

  get startTime() {
    return this._startTime;
  }

  set currentTime(value) {
    this._currentTime = value;
    this.timerWrapper.textContent = this.getTimerStr()

  }

  get currentTime() {
    return this._currentTime
  }

  set isRunning(value) {
    this._isRunning = value;
    value? this.start() : this.pause();
  }

  get isRunning() {
    return this._isRunning;
  }

  getTimerStr() {
    let min = Math.trunc(this.currentTime / 60);
    let sec = Math.trunc(this.currentTime % 60);
    if (min < 10) min = `0${min}`;
    if (sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`
  }
  start() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    clearInterval(this.interval)
  }

  reset() {
    this.isRunning = false;
    this.currentTime = this.startTime;
    this.isRunning = true;
  }


  tick() {
    if (this.currentTime <= 1) {
      this.currentTime = 0;
      this.pause();
      if(this.onTimeOut) this.onTimeOut()
      return;
    }
    --this.currentTime
  }
}