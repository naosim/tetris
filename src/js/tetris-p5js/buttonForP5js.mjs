
export class ButtonForP5js {
  /** @type {number} */
  key;

  isPressed = false;

  /**
   *
   * @param {number} key
   */
  constructor(key) {
    this.key = key;
  }

  isPressStart() {
    if (keyIsDown(this.key)) {
      if (!this.isPressed) {
        this.isPressed = true;
        return true;
      }
    } else if (this.isPressed) {
      this.isPressed = false;
    }
    return false;
  }
}
