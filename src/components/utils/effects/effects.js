import Time from "./effectUtils/time";
import AsciiArtRenderer from "../threeJs/asciiScene";
import ImageBulge from "../imageBulge/imageBulge.js";
import Cursor from "../viewProjectCursor";
import LenisWrapper from "./lenis";
import LoopingElement from "../marquee";


let instance = null

export default class Effects {
  components
  constructor() {
    // singleton setup
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.effects = this 

    // Setup
    this.time = new Time()
    this.lenisWrapper = new LenisWrapper()
    this.components = this.createComponents();

    // Events
    this.time.on('tick', () => {
      this.update()
    })
    window.addEventListener('resize', () => {
      this.resize()
    })
  }
  createComponents() {
    const components = [];
    const asciiCanvas = document.querySelectorAll('#contact-section-canvas')
    const cards = document.querySelectorAll('.canvas-container');

    cards.forEach((el, index) => {
      const canvas = el.querySelector('.image-bulge-scene');
      const textureUrl = el.getAttribute('data-texture');
      components.push(new ImageBulge({ el: canvas, src: textureUrl, index }));
      components.push(new Cursor({el: el}))
    });


    // only run this when in view
    asciiCanvas.forEach((el, index) => {
      const AsciiInstance = new AsciiArtRenderer({ element: el, index })
      components.push(AsciiInstance)
    }) 

    const marqueeElements = document.querySelectorAll('.loop-item')
    components.push( new LoopingElement(marqueeElements[0], 0, 0.015) )
    components.push( new LoopingElement(marqueeElements[1], -100, 0.015) )
    
    return components;
  }

  resize() {
    // call resizes here
    this.components.forEach(component => {
      if (typeof component.resize === 'function') {
        component.resize();
      }
    });
  }

  mouseMove = (e) => {
    this.components.forEach(component => {
      if (typeof component.mouseMove === 'function') {
        component.mouseMove(e);
      }
    });
  }

  update() {
    this.lenisWrapper.update()
    this.components.forEach(component => {
      if (typeof component.update === 'function') {
        component.update();
      }
    });
  }
}