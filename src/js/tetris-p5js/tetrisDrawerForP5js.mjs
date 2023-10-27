import { Tetris, TetrisState } from "../tetris/tetris.mjs";
export const blockSize = 28; // この世界の単位。
export const [width, height] = [blockSize * 20, blockSize * 26]; 
export class TetrisDrawerForP5js {
  /** @type {import("p5").Graphics} */
  #mainGraphics
  /** @type {import("p5").Graphics} */
  #fieldGraphics
  /** @type {import("p5").Graphics} */
  #spriteGraphics

  #particleStore = new ParticleStore();

  #displayedScore = 0;
  constructor(tetris) {
    createCanvas(width, height);
    noStroke();
    noSmooth();

    // @ts-ignore
    this.#mainGraphics = window;

    this.#spriteGraphics = createGraphics(blockSize * 16, blockSize);
    this.setupSpriteGrahics();

    this.#fieldGraphics = createGraphics(width, height);
    this.#fieldGraphics.noStroke();
    this.#fieldGraphics.noSmooth();
    this.drawFieldOnFieldGraphics(tetris);
  }
  /**
   * @param {Tetris} tetris
   */
  draw(tetris) {
    clear(255, 255, 255, 255);
    this.#mainGraphics.image(this.#fieldGraphics, 0, 0);
    tetris.tetromino.forEachBlocks((x, y, value) => this.drawBlock(x, y, value, this.#mainGraphics));

    // score
    if(tetris.score > this.#displayedScore) {
      this.#displayedScore++;
    }
    this.#mainGraphics.fill(0);
    this.#mainGraphics.textSize(blockSize * 1.5);
    text(this.#displayedScore, 13 * blockSize, blockSize * 13);

    this.#particleStore.draw(this.#mainGraphics);
  }

  setupSpriteGrahics() {
    this.#spriteGraphics.noStroke();
    this.#spriteGraphics.noSmooth();
    const merginSize = blockSize / 8;
    for(let i = 1; i < 10; i++) {
      if(i <= 7) {
        const rgb = TetrisDrawerForP5js.valueToRGB(i);
        drawBlock(this.#spriteGraphics, i * blockSize, 0, blockSize, rgb);
      } else {
        this.#spriteGraphics.fill(0);
        this.#spriteGraphics.rect(i * blockSize, 0, blockSize, blockSize);
      }
    }
  }

  /**
   * 
   * @param {TetrisState} newState 
   * @param {TetrisState} before 
   * @param {Tetris} tetris
   */
  onStateChange(newState, before, tetris) {
    this.drawFieldOnFieldGraphics(tetris);
    if(newState.eq(TetrisState.removeLine)) {
      for(let i = 0; i < tetris.removeLineNumbers.length; i++) {
        for(let x = 1; x < 13; x++) {
          this.#particleStore.add(blockSize * x + blockSize / 2, blockSize * tetris.removeLineNumbers[i] + blockSize / 2);
        }
        
      }
    }
  }

  drawFieldOnFieldGraphics(tetris) {
    this.#fieldGraphics.clear(255, 255, 255, 255);
    tetris.field.forEachBlocks((x, y, value) => {
      this.drawBlock(x, y, value, this.#fieldGraphics);
    });

    this.#fieldGraphics.fill(0);
    tetris.nextShapeBlocks.forEachBlocks((x, y, value) => {
      this.drawBlock(x + 14, y + 2, value, this.#fieldGraphics);
    });
    this.#fieldGraphics.fill(0);
    tetris.secondShapeBlocks.forEachBlocks((x, y, value) => {
      this.drawBlock(x + 14, y + 7, value, this.#fieldGraphics);
    });
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} value 
   * @param {import("p5").Graphics} graphic 
   */
  drawBlock(x, y, value, graphic) {
    if(value == 0) {
      graphic.fill(220);
      graphic.rect(x * blockSize, y * blockSize, blockSize, blockSize);
      graphic.fill(255);
      graphic.rect(x * blockSize + 1, y * blockSize + 1, blockSize - 1, blockSize - 1);
    } else {
      graphic.image(
        this.#spriteGraphics, 
        x * blockSize, y * blockSize, blockSize, blockSize, 
        value * blockSize, 0, blockSize, blockSize
      );
    }
  }

  /**
   * 
   * @param {number} value 
   */
  static valueToRGB(value) {
    if(value == 1) {
      return {r: 255, g: 0, b: 0}
    }
    if(value == 2) {
      return {r: 0, g: 255, b: 0}
    }
    if(value == 3) {
      return {r: 0, g: 0, b: 255}
    }
    if(value == 4) {
      return {r: 255, g: 0, b: 255}
    }
    if(value == 5) {
      return {r: 0, g: 255, b: 255}
    }
    if(value == 6) {
      return {r: 200, g: 200, b: 0}
    }
    if(value == 7) {
      return {r: 128, g: 128, b: 128}
    }
    if(value == 9) {
      return {r: 0, g: 0, b: 0}
    }

    return {r: 255, g: 255, b: 255}
    
  }

  drawGameOver() {
    this.#mainGraphics.fill(0);
    this.#mainGraphics.textSize(blockSize * 1.5);
    this.#mainGraphics.text("GAME OVER", blockSize * 1.5, blockSize * 10);

    this.#mainGraphics.textSize(blockSize / 1.5);
    this.#mainGraphics.text("RELOAD TO RESTART", blockSize * 2.5, blockSize * 11);
    this.#mainGraphics.noLoop();
  }
}

/**
 * @param {import("p5").Graphics} graphics
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param { {r:number, g:number, b:number} } rgb
 */ 
function drawBlock(graphics, x, y, size, rgb) {
  graphics.noStroke();

  graphics.fill(rgb.r, rgb.g, rgb.b);
  graphics.rect(x + 1, y + 1, size - 1, size - 1);

  graphics.fill('rgba(255, 255, 255, 0.6)');
  graphics.rect(x + 1, y + 1, size / 2, size - 1);

  graphics.fill('rgba(0, 0, 0, 0.3)');
  graphics.rect(x + size / 2, y + 1, size / 2, size - 1);

  const range = (v, min, max) => Math.min(255, Math.max(128, v));
  graphics.fill(
    range(rgb.r * 2, 128, 255),
    range(rgb.g * 2, 128, 255),
    range(rgb.b * 2, 128, 255)
  );
  graphics.triangle(
    x + 1, y + 1,
    x + size / 2, y + size / 2,
    x + size, y + 1
  );

  graphics.fill(rgb.r / 2, rgb.g / 2, rgb.b / 2);
  graphics.triangle(
    x + 1, y + size,
    x + size / 2, y + size / 2,
    x + size, y + size
  );

  graphics.fill(rgb.r, rgb.g, rgb.b);
  const margin = size / 8;
  graphics.rect(x + margin + 1, y + margin + 1, size - margin * 2 - 1, size - margin * 2 - 1);

  graphics.fill('rgba(255, 255, 255, 0.7)');
  graphics.rect(x + 1 + margin + 2, y + 1 + margin + 2, size - (margin + 3) * 2, size / 5, margin / 2, margin / 2);
}


export class ParticleStore {
  #map = {};
  #index = 0;
  add(x, y) {
    const id = `p${this.#index++}` 
    this.#map[id] = new Particle(this, id, x, y);
  }
  remove(id) {
    delete this.#map[id];
  }

  /**
   * 
   * @param {import("p5").Graphics} graphics 
   */
  draw(graphics) {
    Object.keys(this.#map).forEach(k => this.#map[k].draw(graphics));
  }

}

export class Particle {
  #store;
  #id;
  #x;
  #y;
  #vx;
  #vy;
  #alpha = 1.0;
  constructor(store, id, x, y) {
    this.#store = store;
    this.#id = id;
    this.#x = x;
    this.#y = y;
    const th = Math.random() * Math.PI * 2;
    this.#vx = Math.cos(th) * 3;
    this.#vy = Math.sin(th) * 3;
  }
  remove() {
    this.#store.remove(this.#id);
    this.#store = null;
  }

  /**
   * 
   * @param {import("p5").Graphics} graphics 
   */
  draw(graphics) {
    const [targetX, targetY] = [blockSize * 13, blockSize * 13]
    fill(`rgba(255, 255, 0, ${this.#alpha})`)
    graphics.circle(this.#x, this.#y, blockSize);

    const distance = Math.sqrt(Math.pow(targetX - this.#x, 2) + Math.pow(targetY - this.#y, 2))
    const ax = (targetX - this.#x) / distance * 0.5;
    const ay = (targetY - this.#y) / distance * 0.5;
    this.#vx += ax;
    this.#vy += ay;
    this.#x += this.#vx;
    this.#y += this.#vy;
    this.#alpha -= 0.02;
    if(this.#alpha <= 0) {
      this.remove();
    }
  }
}