import Lenis from "@studio-freight/lenis";
import Effects from "./effects";

export default class LenisWrapper {
  constructor() {
    // Check if user is on macOS
    this.effects = new Effects()

    const isMacOS = navigator.userAgent.indexOf("Mac OS X") !== -1;
    const lerp = isMacOS ? 0.4 : 0.1;
    
    this.lenis = new Lenis({
      lerp,
    });
    
    window.lenis = this.lenis;

    // this is the standard lenis code, for reference:
      // import Lenis from "@studio-freight/lenis";

      // // Check if user is on macOS
      // const isMacOS = navigator.userAgent.indexOf("Mac OS X") !== -1;

      // const lerp = isMacOS ? 0.4 : 0.1;
      // const lenis = new Lenis({
      //   lerp,
      // });

      // function raf(time) {
      //   lenis.raf(time);
      //   requestAnimationFrame(raf);
      // }
      // requestAnimationFrame(raf);

      // // Assign the Lenis instance to a global variable
      // window.lenis = lenis;
  }

  update() {
    this.lenis.raf(this.effects.time.elapsed);
  }
}

