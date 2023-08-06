import Scene from '../components/scene.js'
import { gsap } from 'gsap/gsap-core'
import { isTouch } from '../utils/isTouch'
import GUI from 'lil-gui'

export default class App {
  #components
  #guiCard = {
    bulge: 0,
    strength: 1.1,
    radius: .95,
  }
  #debug
  constructor() {
    this.#components = this.createComponents()
    this.#debug = this.createDebugger()
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
      components.push(new Scene({ el: canvas, src: textureUrl, index, guiObj: this.#guiCard }))
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

  createDebugger() {
    const gui = new GUI()

    const handleChange = () => {
      for (let i = 0; i < this.#components.length; i++) {
        const comp = this.#components[i]

        if (comp.type === 'card') {
          comp.program.uniforms.uRadius.value = this.#guiCard.radius
          comp.program.uniforms.uStrength.value = this.#guiCard.strength
        }
      }
    }

    gui.add(this.#guiCard, 'radius', 0, 1).onChange(handleChange)
    gui.add(this.#guiCard, 'strength', 0, 3).onChange(handleChange)

    return gui
  }
}
