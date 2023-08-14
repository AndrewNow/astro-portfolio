 export default class LoopingElement {
    constructor(element, currentTranslation, speed) {
      this.lenis = window.lenis;

      this.element = element;
      this.currentTranslation = currentTranslation;

      this.speed = speed;
      this.direction = false;
      this.scrollTop = 0;
      this.metric = 100; // translate 100% of div

      this.lerp = {
        current: this.currentTranslation,
        target: this.currentTranslation,
        factor: 0.2,
      };
    }

    lerpFunc(current, target, factor) {
      // lerp.current = how much we want to translate by
      this.lerp.current = current * (1 - factor) + target * factor;
    }

    goForward() {
      this.lerp.target += this.speed;
      // if lerp target goes off the screen
      if (this.lerp.target > this.metric) {
        this.lerp.current -= this.metric * 2;
        this.lerp.target -= this.metric * 2;
      }
    }

    goBackward() {
      this.lerp.target -= this.speed;
      if (this.lerp.target < -this.metric) {
        this.lerp.current -= -this.metric * 2;
        this.lerp.target -= -this.metric * 2;
      }
    }

    update() {
      this.direction ? this.goForward() : this.goBackward();
      this.lerpFunc(this.lerp.current, this.lerp.target, this.lerp.factor);
      this.element.style.transform = `translate(${this.lerp.current}%, -50%)`;
    }
  }