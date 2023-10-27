import * as Types from "./typedef.mjs";

/**
 * @implements {Types.BlocksRef}
 */
export class ShapeBlocks {
  /** @type {Types.Pos[]} */
  #shapeValues;
  /** @type {number} */
  #rotationType;
  /** @type {number} */
  #value;

  #rotationCount;

  get rotationType() {
    return this.#rotationType;
  }
  get value() {
    return this.#value;
  }

  /**
   * @param {Types.Pos[]} shape
   * @param {number} rotationType
   * @param {number} value
   * @param {number} rotationCount
   */
  constructor(shape, rotationType, value, rotationCount) {
    this.#shapeValues = shape;
    this.#rotationType = rotationType;
    this.#value = value;
    this.#rotationCount = rotationCount;
  }

  /**
   *
   * @param { Types.ForEachBlocksCallback } cb
   */
  forEachBlocks(cb) {
    this.#shapeValues.forEach(v => cb(v.x, v.y, this.#value));
  }

  /**
   * @template T
   * @param {(pos:Types.Pos) => T} cb
   * @returns {T[]}
   */
  map(cb) {
    return this.#shapeValues.map(v => cb(v));
  }

  /**
   *
   * @param {Types.Pos[]} shape
   * @param {number} rotationCount
   * @returns
   */
  toNewShape(shape, rotationCount) {
    return new ShapeBlocks(shape, this.#rotationType, this.#value, rotationCount);
  }

  /**
   *
   * @returns {ShapeBlocks}
   */
  rotate() {
    if (this.rotationType == 1) {
      return this;
    }

    if (this.#rotationType == 4) {
      const newShape = this.#shapeValues.map(v => {
        return { x: -v.y, y: v.x };
      });
      return this.toNewShape(newShape, 0);
    }
    if (this.#rotationType == 2) {
      var newShape;
      var rotationCount;
      if (this.#rotationCount == 0) {
        newShape = this.#shapeValues.map(v => {
          return { x: -v.y, y: v.x };
        });
        rotationCount = 1;
      } else {
        newShape = this.#shapeValues.map(v => {
          return { x: v.y, y: -v.x };
        });
        rotationCount = 0;
      }
      return this.toNewShape(newShape, rotationCount);
    }

    throw new Error("プログラムのバグ");
  }
}
