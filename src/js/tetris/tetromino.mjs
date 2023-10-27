import { Field } from "./field.mjs";
import * as Types from "./typedef.mjs";
import { ShapeBlocks } from "./shapeBlocks.mjs";


/**
 * テトロミノ 落ちてくるブロック
 * @implements {Types.BlocksRef}
 */
export class Tetromino {
  #x = 5;
  #y = Tetromino.#startY;
  /** @type {ShapeBlocks} */
  #shapeBlocks;  
  static #startY = 1;
  #isEnd = false;

  /**
   * 
   * @param {ShapeBlocks} shapeBlocks 
   */
  constructor(shapeBlocks) {
    this.#shapeBlocks = shapeBlocks;
  }

  get #blockPositionsOnField() {
    return this.#shapeBlocks.map(v => ({ x: v.x + this.#x, y: v.y + this.#y }));
  }

  /**
   * @returns {Types.BlocksRef}
   */
  get shapeBlocks() {
    return this.#shapeBlocks;
  }

  isMoved() {
    return this.#y != Tetromino.#startY;
  }

  end() {
    this.#isEnd = true;
  }


  /**
   *
   * @param { Types.ForEachBlocksCallback } cb
   */
  forEachBlocks(cb) {
    if(this.#isEnd) {
      return;
    }
    this.#blockPositionsOnField.forEach(v => cb(v.x, v.y, this.#shapeBlocks.value));
    // this.#blocks.forEach(v => cb(v.x + this.#x, v.y + this.#y, 1));
  }

  /**
   * @param {Field} field
   * @returns {boolean} 回転したらtrueを返す
   */
  rotateIfPossible(field) {
    // 回転した形を生成
    const newShapeBlocks = this.#shapeBlocks.rotate();

    // 回転させた形がフィールドに当たるか確認する
    const blockPositionsOnField = newShapeBlocks.map(v => ({x: v.x + this.#x, y: v.y + this.#y}))
    var canRotate = true;
    for (let v of blockPositionsOnField) {
      if (field.isHit(v.x, v.y)) {
        canRotate = false;
        break;
      }
    }
    
    // 当たらなければ更新する
    if(canRotate) {
      this.#shapeBlocks = newShapeBlocks;
    }
    return canRotate;
  }

  /**
   * @param {Field} field
   * @returns {boolean} 移動したらtrueを返す
   */
  moveRightIfPossible(field) {
    if (this.#canMove(field, 1, 0)) {
      this.#x++;
      return true;
    }
    return false;
  }

  /**
   * @param {Field} field
   * @returns {boolean} 移動したらtrueを返す
   */
  moveLeftIfPossible(field) {
    if (this.#canMove(field, -1, 0)) {
      this.#x--;
      return true;
    }
    return false;
  }

  /**
   * 下に移動できるか。
   * @param {Field} field
   * @returns {boolean} 下に動けるならtrue、下にブロックがあって動けない場合はfalse
   */
  canMoveDown(field) {
    return this.#canMove(field, 0, 1);
  }

  /**
   * 下に移動できるか。
   * @param {Field} field
   * @param {number} diffX,
   * @param {number} diffY,
   * @returns {boolean} 下に動けるならtrue、下にブロックがあって動けない場合はfalse
   */
  #canMove(field, diffX, diffY) {
    const ary = this.#blockPositionsOnField;
    for (let v of ary) {
      if (field.isHit(v.x + diffX, v.y + diffY)) {
        return false;
      }
    }
    return true;
  }

  moveDown() {
    this.#y++;
  }

  /**
   * @param {Field} field
   * @returns {boolean} ゲームオーバーかどうか。（ちょっと強引な実装）
   */
  mergeToField(field) {
    this.#blockPositionsOnField.forEach(v => field.setValue(v.x, v.y, this.#shapeBlocks.value));
    return this.#y == Tetromino.#startY;
  }

}

