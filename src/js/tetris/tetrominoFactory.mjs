import { ShapeBlocks } from "./shapeBlocks.mjs";
import { Tetromino } from "./tetromino.mjs";


export class TetrominoFactory {
  createRandom() {
    const typeT = {
      shape: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
      ],
      rotationType: 4,
      value: 1,
    };

    const typeL = {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      rotationType: 4,
      value: 2,
    };

    const typeJ = {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
      ],
      rotationType: 4,
      value: 3,
    };

    const typeZ = {
      shape: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      ],
      rotationType: 2,
      value: 4,
    };

    const typeS = {
      shape: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 1 }
      ],
      rotationType: 2,
      value: 5,
    };

    const typeI = {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 0, y: 2 }
      ],
      rotationType: 2,
      value: 6,
    };

    const typeO = {
      shape: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      ],
      rotationType: 1,
      value: 7,
    };

    const types = [
      typeI, typeJ, typeL, typeO, typeS, typeT, typeZ
    ];
    const num = Math.floor(Math.random() * types.length);
    const type = types[num];
    return new Tetromino(new ShapeBlocks(type.shape, type.rotationType, type.value, 0));
  }
}
