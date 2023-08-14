import EventEmitter from "./eventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();
    // setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    // at 60 fps, delta time is usually 16
    this.delta = 16;

    // wait 1 frame before calling tick to avoid bugs in this.delta
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
