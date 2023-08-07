import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import vertex from "../glsl/main.vert";
import fragment from "../glsl/main.frag";
import LoaderManager from "../managers/LoaderManager";
import { gsap } from "gsap/gsap-core";
import { isTouch } from "../utils/isTouch";
import IntersectionObserver from "../managers/IntersectionObserver";

export default class Scene {
  #el;
  #renderer;
  #mesh;
  #program;
  #mouse = new Vec2(0, 0);
  #mouseTarget = new Vec2(0, 0);
  #elRect;
  #canMove = true;
  #src;
  #index;
  #isTouch;
  #visible;
  constructor({ el, src, index }) {
    this.#el = el;
    this.#src = src;
    this.#index = index;
    this.setScene();

    this.#el.dataset.intersectId = index;

    this.#isTouch = isTouch();
  }

  get type() {
    return "card";
  }

  get program() {
    return this.#program;
  }

  async setScene() {
    this.#renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas: this.#el,
      width: this.#el.offsetWidth,
      height: this.#el.offsetHeight,
    });

    const { gl } = this.#renderer;

    // Preloading
    await LoaderManager.load(
      [
        {
          name: `${this.#src}`,
          texture: `${this.#src}`,
        },
      ],
      gl
    );

    gl.clearColor(1, 1, 1, 1);

    this.resize();

    const geometry = new Triangle(gl);
    const texture = LoaderManager.get(`${this.#src}`);

    this.#program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTexture: { value: texture },
        uTextureResolution: {
          value: new Vec2(texture.image.width, texture.image.height),
        },
        uResolution: {
          value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight),
        },
        uMouse: { value: this.#mouse },
        uMouseIntro: { value: new Vec2(0.5, 0) },
        uIntro: { value: 0 },
        uBulge: { value: 0 },
        uStrength: { value: 1.1 },
        uRadius: { value: 0.975 },
      },
    });

    this.#mesh = new Mesh(gl, { geometry, program: this.#program });

    this.events();

    IntersectionObserver.observe(this.#index, this.#el, this.show, this.hide);
  }

  show = () => {
    let delay = 0;

    this.tlHide?.kill();
    this.tlShow = gsap.timeline();

    gsap.delayedCall(delay, () => {
      this.#el.parentNode.parentNode.classList.add("is-visible");
    });

    this.tlShow.fromTo(
      this.#program.uniforms.uBulge,
      { value: 1 },
      {
        value: 0,
        duration: 1.8,
        ease: "power3.out",
        delay,
      }
    );

    this.tlShow.to(
      this.#program.uniforms.uIntro,
      { value: 1, duration: 5, delay },
      0
    );

    this.#visible = true;
  };

  hide = () => {
    let delay = 0;

    this.tlShow?.kill();
    this.tlHide = gsap.timeline();

    gsap.delayedCall(delay, () => {
      this.#el.parentNode.parentNode.classList.remove("is-visible");
    });

    this.tlHide.to(this.#program.uniforms.uBulge, {
      value: 1,
      duration: 1.8,
      ease: "power3.out",
      delay,
    });

    this.tlHide.to(
      this.#program.uniforms.uIntro,
      { value: 0, duration: 1, delay },
      0
    );

    this.#visible = false;
  };

  events() {
    this.#el.addEventListener("mouseenter", this.handleMouseEnter, false);
    this.#el.addEventListener("mouseleave", this.handleMouseLeave, false);
  }

  render = () => {
    if (!this.#program) return;

    this.#mouseTarget.x = gsap.utils.interpolate(
      this.#mouseTarget.x,
      this.#mouse.x,
      0.1
    );
    this.#mouseTarget.y = gsap.utils.interpolate(
      this.#mouseTarget.y,
      this.#mouse.y,
      0.1
    );

    this.#program.uniforms.uMouse.value = this.#mouseTarget;

    // Don't need a camera if camera uniforms aren't required
    this.#renderer.render({ scene: this.#mesh });
  };

  mouseMove = (e) => {
    if (!this.#canMove || !this.#program || !this.#visible) return;

    this.#elRect = this.#el.getBoundingClientRect();

    let eventX = this.#isTouch ? e.touches[0].pageX : e.clientX;
    let eventY = this.#isTouch ? e.touches[0].pageY : e.clientY;

    const x = (eventX - this.#elRect.left) / this.#el.offsetWidth;
    const y = 1 - (eventY - this.#elRect.top) / this.#el.offsetHeight;

    this.#mouse.x = gsap.utils.clamp(0, 1, x);
    this.#mouse.y = gsap.utils.clamp(0, 1, y);
  };

  handleMouseEnter = () => {
    if (!this.#canMove) return;
    this.tlHide?.kill();
    this.tlShow?.kill();
    // this.tlLeave?.kill()
    this.tlForceIntro = new gsap.timeline();
    this.tlForceIntro.to(this.#program.uniforms.uIntro, {
      value: 1,
      duration: 5,
      ease: "expo.out",
    });
    gsap.to(this.#program.uniforms.uBulge, {
      value: 1,
      duration: 1,
      ease: "expo.out",
    });
  };

  handleMouseLeave = () => {
    if (!this.#canMove) return;
    this.tlForceIntro?.kill();
    this.tlLeave = new gsap.timeline();
    this.tlLeave.to(this.#program.uniforms.uBulge, {
      value: 0,
      duration: 1,
      ease: "expo.out",
    });
  };

  resize = () => {
    const w = this.#el.parentNode.offsetWidth;
    const h = this.#el.parentNode.offsetHeight;
    this.#renderer.setSize(w, h);

    this.#elRect = this.#el.getBoundingClientRect();

    if (this.#program) {
      this.#program.uniforms.uResolution.value = new Vec2(w, h);
    }
    this.#isTouch = isTouch();
  };
}
