import Scene from '../components/scene.js'
import { gsap } from 'gsap/gsap-core'
import { isTouch } from '../utils/isTouch'
import GUI from 'lil-gui'

export default class App {
  #components
  constructor() {
    this.#components = this.createComponents()
    this.events()
  }

  createComponents() {
    const components = []

    const cards = document.querySelectorAll('.canvas-container')

    // Set up components
    cards.forEach((el, index) => {
      const canvas = el.querySelector('.image-bulge-scene')
      const textureUrl = el.getAttribute("data-texture")
      // scene
      components.push(new Scene({ el: canvas, src: textureUrl, index}))
    })

    return components
  }

  events() {
    gsap.ticker.add(this.handleRAF)

    window.addEventListener('resize', this.handleResize, false)

    if (isTouch()) {
      window.addEventListener('touchmove', this.handleMouseMove, false)
    } else {
      window.addEventListener('mousemove', this.handleMouseMove, false)
    }
  }

  handleRAF = (time) => {
    // this.#lenis.raf(time * 1000)
    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.render === 'function') {
        comp.render(time)
      }
    }
  }

  handleResize = () => {
    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.resize === 'function') {
        comp.resize()
      }
    }
  }

  handleMouseMove = (e) => {
    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]
      if (typeof comp.mouseMove === 'function') {
        comp.mouseMove(e)
      }
    }
  }

  handleScroll = (e) => {
    // this.scrollEl.classList.remove('is-visible')
    // console.log(this.scrollEl)

    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.scroll === 'function') {
        comp.scroll(e.progress)
      }
    }
  }
}
