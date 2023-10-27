import * as Types from "./typedef.mjs";

/** @implements Types.BlocksRef */
export class Field {
  /** @type {number[][]} */
  #values = [
    ...Field.#copyAry([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], 21),
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ];

  get values() {
    return this.#values;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  isHit(x, y) {
    return this.#values[y][x] > 0;
  }

  /**
   *
   * @param { Types.ForEachBlocksCallback } cb
   */
  forEachBlocks(cb) {
    for (let y = 0; y < this.#values.length; y++) {
      for (let x = 0; x < this.#values[0].length; x++) {
        cb(x, y, this.#values[y][x]);
      }
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  setValue(x, y, value) {
    this.#values[y][x] = value;
  }

  /**
   * そろった行番号を返す
   * @returns {number[]}
   */
  getCompleteLineNumbers() {
    const result = [];
    for(let y = 1; y < this.#values.length - 1; y++) {
      var count = this.#values[y].reduce((memo, n) => memo + (n > 0 ? 1 : 0), 0);
      if(count == this.#values[0].length) {
        result.push(y);
      }
    }
    return result;
  }

  /**
   * 
   * @param {number[]} removeLineNumbers 
   */
  removeLines(removeLineNumbers) {
    removeLineNumbers.forEach(v => {
      this.#values[v] = [9,0,0,0,0,0,0,0,0,0,0,9];// 対象行を空にする
    });
  }

  compressLines(removeLineNumbers) {
    const result = [];
    for(let y = this.#values.length - 1; y > 0; y--) {
      if(removeLineNumbers.indexOf(y) == -1) {
        result.push(this.#values[y])
      }
    }
    for(let y = 0; y < removeLineNumbers.length; y++) {
      result.push([9,0,0,0,0,0,0,0,0,0,0,9]);
    }
    result.push([9,0,0,0,0,0,0,0,0,0,0,9]);

    this.#values = result.reverse();
  }

  /**
   *
   * @param {number[]} ary
   * @param {number} times
   * @returns {number[][]}
   */
  static #copyAry(ary, times) {
    return new Array(times).fill(null).map(v => ary.concat());
  }
}
