import { Tetromino } from "./tetromino.mjs";
import { TetrominoFactory } from "./tetrominoFactory.mjs";
import { Field } from "./field.mjs";
import * as Types from "./typedef.mjs";

/**
 * テトリスのロジック
 * ゲームが始まってゲームオーバになるまでが責務
 * 2回目のゲームをする場合は本クラスをnewし直すこと
 */
export class Tetris {
  static fallingStepFrames = 40; // ゲームの難易度。増やすほど簡単。
  #score = 0;
  #field = new Field();
  #tetrominoStore = new TetrominoStore();
  #tetromino = this.#createTetromino();
  #step = 0;
  /** @type {TetrisState} */
  #_state = TetrisState.fallingTetromino;
  /** @type {number[]} */
  #removeLineNumbers = [];

  /** @type {TetrisEventListener | undefined} */
  tetrisEventListener;

  /**
   * @returns {Types.BlocksRef}
   */
  get field() {
    return this.#field;
  }

  get score() {
    return this.#score;
  }

  get removeLineNumbers() {
    return this.#removeLineNumbers;
  }

  /**
   * @returns {Types.BlocksRef}
   */
  get tetromino() {
    return this.#tetromino;
  }

  get nextShapeBlocks() {
    return this.#tetrominoStore.referenceNext();
  }

  get secondShapeBlocks() {
    return this.#tetrominoStore.referenceSecond();
  }

  get isGameOver() {
    return this.#state.isGameOver();
  }

  get #state() {
    return this.#_state;
  }

  get state() {
    return this.#_state;
  }


  /**
   * @param {TetrisState} state
   */
  set #state(state) {
    const lastState = this.#_state;
    setTimeout(() => {
      this.#_state = state;
      if(this.tetrisEventListener && this.tetrisEventListener.onStateChange) {
        this.tetrisEventListener.onStateChange(this.#_state, lastState);
      }
    }, 0);
    
  }

  #wait = Tetris.fallingStepFrames;

  /**
   * 更新。30FPSで呼ばれることを想定
   * @param {Types.Pad} pad
   */
  update(pad) {
    if(this.#state.eq(TetrisState.fallingTetromino)) {
      this.#updateForFalling(pad);
    } else if(this.#state.eq(TetrisState.onField)) {
      this.#updateOnField();
    } else if(this.#state.eq(TetrisState.removeLine)) {
      this.#updateForRemoveLines();
    } else if(this.#state.eq(TetrisState.setupNext)) {
      this.#updateForSetupNext();
    } else if(this.#state.eq(TetrisState.gameover)) {
      // nop
    }

    this.#step++;
    if(this.#step >= Tetris.fallingStepFrames) {
      this.#step = 0;
    }
  }

  /**
   * テトロミノが落ちがる状態の更新
   * 
   * 処理：
   * - ボタン操作に合わせてテトロミノを動かす
   * 
   * 状態遷移：
   * - フィールドに着いたら、TetrisState.onFieldへ遷移
   * 
   * @param {Types.Pad} pad
   */
  #updateForFalling(pad) {
    const moveEvents = {
      rotate: false,
      left: false,
      right: false,
      down: false
    };
    if(pad.rotationButtonIsDown) {
      moveEvents.rotate = this.#tetromino.rotateIfPossible(this.#field);
    }
    if(pad.leftKeyIsDown) {
      moveEvents.left = this.#tetromino.moveLeftIfPossible(this.#field);
    }
    if(pad.rightKeyIsDown) {
      moveEvents.right = this.#tetromino.moveRightIfPossible(this.#field);
    }

    if(this.#step % Tetris.fallingStepFrames == 0) {
      if(this.#tetromino.canMoveDown(this.#field)) {
        this.#tetromino.moveDown();
      } else {
        this.#state = TetrisState.onField;
      }
    } else if(pad.downKeyIsDown && this.#tetromino.canMoveDown(this.#field)) {
      this.#tetromino.moveDown();
      moveEvents.down = true;
    }

    if(this.tetrisEventListener && this.tetrisEventListener.onTetrominoMove) {
      this.tetrisEventListener.onTetrominoMove(moveEvents);
    }
  }

  /**
   * テトロミノが落ちた状態の更新
   * 
   * 処理：
   * - テトロミノをフィールドにマージする
   * - 消せる行を探す
   * 
   * 状態遷移：
   * - 消せる行があれば消して、TetrisState.removeLineへ遷移
   * - なければTetrisState.setupNextへ遷移
   * 
   */
  #updateOnField() {
    this.#tetromino.mergeToField(this.#field);
    this.#tetromino.end();
    this.#removeLineNumbers = this.#field.getCompleteLineNumbers();
    if(this.#removeLineNumbers.length > 0) {
      this.#field.removeLines(this.#removeLineNumbers);
      this.#state = TetrisState.removeLine;
    } else {
      this.#state = TetrisState.setupNext;
    }
  }

  /**
   * 行が消えた状態の更新
   * 
   * 処理：
   * - 少し待つ
   * - 空の行を下に詰める
   * 
   * 状態遷移：
   * - TetrisState.setupNext
   * 
   */
  #updateForRemoveLines() {
    this.#wait--;
    if(this.#wait > 0) {
      return;
    }

    this.#field.compressLines(this.#removeLineNumbers);
    this.#updateScore(this.#removeLineNumbers.length);
    this.#removeLineNumbers = [];
    this.#wait = Tetris.fallingStepFrames;
    this.#state = TetrisState.setupNext;
  }

  /**
   * 
   * @param {number} removeLineNumberCount 
   */
  #updateScore(removeLineNumberCount) {
    this.#score += Math.pow(removeLineNumberCount, 2) * 100;
    console.log(this.#score);
  }

  /**
   * 次のテトロミノをセットアップする状態の更新
   * 
   * 状態遷移：
   * - ゲームオーバーなら、TetrisState.gameoverへ遷移
   * - 継続可能なら、TetrisState.fallingTetrominoへ遷移
   */
  #updateForSetupNext() {
    if(this.#tetromino.isMoved()) {
      this.#tetromino = this.#createTetromino();
      this.#state = TetrisState.fallingTetromino;
    } else {
      this.#state = TetrisState.gameover;
    }
  }

  #createTetromino() {
    return this.#tetrominoStore.next();
  }
}

export class TetrominoStore {
  #tetrominos;
  #tetrominoFactory = new TetrominoFactory();
  constructor() {
    this.#tetrominos = new Array(5).fill(null).map(v => this.#tetrominoFactory.createRandom());
  }

  /**
   * @returns {Tetromino}
   */
  next() {
    this.#tetrominos.push(this.#tetrominoFactory.createRandom());
    // @ts-ignore
    return this.#tetrominos.shift();
  }

  /**
   * 次を参照する
   * 
   * 見るだけ。非破壊的参照
   * @returns {Types.BlocksRef}
   */
  referenceNext() {
    return this.#tetrominos[0].shapeBlocks;
  }

  /**
   * 次を参照する
   * 
   * 見るだけ。非破壊的参照
   * @returns {Types.BlocksRef}
   */
  referenceSecond() {
    return this.#tetrominos[1].shapeBlocks;
  }
}

export class TetrisState {
  /** テトロミノが落ちがる状態 */
  static fallingTetromino = new TetrisState("fallingTetromino")

  /** テトロミノが落ちた状態 */
  static onField = new TetrisState("onField")

  /** そろったフィールドが消された状態 */
  static removeLine = new TetrisState("removeLine")

  /** 次のテトロミノをセットアップする状態 */
  static setupNext = new TetrisState("setupNext");

  /** ゲームオーバーした状態 */
  static gameover = new TetrisState("gameover");

  /** @typedef {"fallingTetromino" | "onField" | "removeLine" | "setupNext" | "gameover"} State */

  /** @type {State} */
  #value;
  /**
   * @param {State} value
   */
  constructor(value) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  /**
   * @param {TetrisState} other 
   */
  eq(other) {
    return this.#value == other.#value;
  }

  isGameOver() {
    return this.eq(TetrisState.gameover);
  }
}


/**
 * @typedef TetrominoMoveEvents
 * @property {boolean} rotate
 * @property {boolean} left
 * @property {boolean} right
 * @property {boolean} down
 */

/**
 * @typedef TetrisEventListener
 * @property {((after: TetrisState, before: TetrisState) => void) | undefined} onStateChange
 * @property {((events: TetrominoMoveEvents) => void) | undefined} onTetrominoMove
 */
