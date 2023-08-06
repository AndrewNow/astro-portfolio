import Scene from '../components/scene.js';
import { gsap } from 'gsap/gsap-core';
import { isTouch } from '../utils/isTouch';

export default class App {
  #components;
  
  constructor() {
    this.#components = this.createComponents();
    this.events();
  }

  createComponents() {
    const components = [];
    const cards = document.querySelectorAll('.canvas-container');

    cards.forEach((el, index) => {
      const canvas = el.querySelector('.image-bulge-scene');
      const textureUrl = el.getAttribute('data-texture');
      components.push(new Scene({ el: canvas, src: textureUrl, index }));
    });

    return components;
  }

  handleRAF = (time) => {
    for (const comp of this.#components) {
      if (typeof comp.render === 'function') {
        comp.render(time);
      }
    }
  }

  handleResize = () => {
    for (const comp of this.#components) {
      if (typeof comp.resize === 'function') {
        comp.resize();
      }
    }
  }

  handleMouseMove = (e) => {
    for (const comp of this.#components) {
      if (typeof comp.mouseMove === 'function') {
        comp.mouseMove(e);
      }
    }
  }

  handleScroll = (e) => {
    for (const comp of this.#components) {
      if (typeof comp.scroll === 'function') {
        comp.scroll(e.progress);
      }
    }
  }

  events() {
    gsap.ticker.add(this.handleRAF);

    window.addEventListener('resize', this.handleResize, false);

    const eventType = isTouch() ? 'touchmove' : 'mousemove';
    window.addEventListener(eventType, this.handleMouseMove, false);
  }
}
