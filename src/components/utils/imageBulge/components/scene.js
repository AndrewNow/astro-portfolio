import GUI from 'lil-gui'
import { Renderer, Program, Vec2, Mesh, Triangle, Texture } from 'ogl'
import vertex from '../glsl/main.vert'
import fragment from '../glsl/main.frag'
import { isTouch } from '../utils/isTouch'
import LoaderManager from '../managers/LoaderManager'

class Scene {
  #renderer
  #mesh
  #program
  #guiObj = {
    offset: 1,
  }
  #mouse = new Vec2(0.5, 0.5)
  #isTouch
  constructor() {
    this.setGUI()
    this.setScene()
    this.events()
  }

  setGUI() {
    const gui = new GUI()

    const handleChange = (value) => {
      this.#program.uniforms.uOffset.value = value
    }

    gui.add(this.#guiObj, 'offset', 0.5, 4).onChange(handleChange)
  }

  async setScene() {
    const canvasEl = document.querySelector('.image-bulge-scene')
    this.#renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), canvas: canvasEl })
    const gl = this.#renderer.gl
    gl.clearColor(1, 1, 1, 1)

    // load our texture
    const loadTexture = (url) =>
      
      new Promise((resolve) => {
        const image = new Image()
        const texture = new Texture(gl)

        image.onload = () => {
          texture.image = image
          resolve(texture)
        }

        image.src = url
      })


    const texture = await loadTexture('/assets/rm/thumbnail.png')

    this.handleResize()

    // Rather than using a plane (two triangles) to cover the viewport here is a
    // triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
    // Excess will be out of the viewport.

    //         position                uv
    //      (-1, 3)                  (0, 2)
    //         |\                      |\
    //         |__\(1, 1)              |__\(1, 1)
    //         |__|_\                  |__|_\
    //   (-1, -1)   (3, -1)        (0, 0)   (2, 0)

    const geometry = new Triangle(gl)

    this.#program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uTextureResolution: { value: new Vec2(texture.image.width, texture.image.height) },
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        uMouse: { value: new Vec2(0.5, 0.5) },
      },
    })

    this.#mesh = new Mesh(gl, { geometry, program: this.#program })
  }

  events() {
    window.addEventListener('resize', this.handleResize, false)
    window.addEventListener('mousemove', this.handleMouseMove, false)
    requestAnimationFrame(this.handleRAF)
  }

  handleResize = () => {
    this.#renderer.setSize(window.innerWidth, window.innerHeight)

    if (this.#program) {
      this.#program.uniforms.uResolution.value = new Vec2(window.innerWidth, window.innerHeight)
    }

    this.#isTouch = isTouch()
  }
  
  handleMouseMove = (e) => {
    let eventX = this.#isTouch ? e.touches[0].pageX : e.clientX
    let eventY = this.#isTouch ? e.touches[0].pageY : e.clientY
    const x = eventX / window.innerWidth
    const y = 1 - eventY / window.innerHeight
    
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    this.#mouse.x = clamp(0, 1, x);
    this.#mouse.y = clamp(0, 1, y);
  }

  handleRAF = (t) => {
    requestAnimationFrame(this.handleRAF)

    // Don't need a camera if camera uniforms aren't required
    if (this.#mesh) {
      this.#renderer.render({ scene: this.#mesh })
      this.#program.uniforms.uMouse.value = this.#mouse
    }
  }
}

export default Scene
