import Scene from '../components/scene.js';
import { gsap } from 'gsap/gsap-core';
import { isTouch } from '../utils/isTouch';
import Lenis from "@studio-freight/lenis";

export default class App {
  #components;
  #lenis; // Store Lenis instance separately

  constructor() {
    this.initLenis(); // Initialize Lenis first
    this.#components = this.createComponents();
    this.events();
    this.startRAF(); // Start RAF loop after Lenis is initialized
  }

  initLenis() {
    const isMacOS = navigator.userAgent.indexOf("Mac OS X") !== -1;
    const lerp = isMacOS ? 0.4 : 0.1;
    
    this.#lenis = new Lenis({
      lerp,
    });

    window.lenis = this.#lenis;
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
    this.#components.forEach(component => {
      if (typeof component.render === 'function') {
        component.render(time);
      }
    });
  }

  handleResize = () => {
    this.#components.forEach(component => {
      if (typeof component.resize === 'function') {
        component.resize();
      }
    });
  }

  handleMouseMove = (e) => {
    this.#components.forEach(component => {
      if (typeof component.mouseMove === 'function') {
        component.mouseMove(e);
      }
    });
  }

  handleScroll = (e) => {
    this.#components.forEach(component => {
      if (typeof component.scroll === 'function') {
        component.scroll(e.progress);
      }
    });
  }

  events() {
    gsap.ticker.add(this.handleRAF);

    window.addEventListener('resize', this.handleResize, false);

    const eventType = isTouch() ? 'touchmove' : 'mousemove';
    window.addEventListener(eventType, this.handleMouseMove, false);
  }

  // Start RAF loop separately after Lenis is initialized
  startRAF = () => {
    const raf = (time) => {
      this.handleRAF(time);
      this.#lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  };
}
