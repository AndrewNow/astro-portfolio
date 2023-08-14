import Effects from "./effects/effects";

export default class Cursor {
  constructor({ el }) {
    this.el = el;
    this.effects = new Effects()
    // Create a new div for the cursor
    this.cursorDiv = document.createElement('div');
    this.cursorDiv.classList.add('custom-cursor');
    this.el.appendChild(this.cursorDiv);

    // Get cursor size from the computed style
    this.cursorWidth = parseFloat(getComputedStyle(this.cursorDiv).width);
    this.cursorHeight = parseFloat(getComputedStyle(this.cursorDiv).height);

    // Initialize cursor position
    this.cursorX = 0;
    this.cursorY = 0;

    // Initialize target position
    this.targetX = 0;
    this.targetY = 0;

    // Add event listeners
    this.el.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.el.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    this.lerpAmount = .2
  }

  handleMouseEnter() {
    this.cursorDiv.style.opacity = 1;
  }

  handleMouseMove(event) {
    const { offsetX, offsetY } = event; // Get position relative to the container

    // Update target position
    this.targetX = offsetX - this.cursorWidth / 2;
    this.targetY = offsetY - this.cursorHeight / 2;
  }

  handleMouseLeave() {
    this.cursorDiv.style.opacity = 0;
  }

  update() {
    // Calculate lerp values
    this.cursorX = this.lerp(this.cursorX, this.targetX, this.lerpAmount);
    this.cursorY = this.lerp(this.cursorY, this.targetY, this.lerpAmount);

    // Update cursor position
    this.cursorDiv.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
}
