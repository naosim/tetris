import { ButtonForP5js } from "./buttonForP5js.mjs";
import {Tetris, TetrisState} from "../tetris/tetris.mjs"
import * as Types from "../tetris/typedef.mjs";
import { TetrisDrawerForP5js } from "./tetrisDrawerForP5js.mjs";

window.setup = () => {
  var tetris = new Tetris();

  const upButtonKey = new ButtonForP5js(UP_ARROW);
  const leftButtonKey = new ButtonForP5js(LEFT_ARROW);
  const rightButtonKey = new ButtonForP5js(RIGHT_ARROW);
  const tetrisDrawer = new TetrisDrawerForP5js(tetris);
  

  
  window.draw = () => {
    /** @type {Types.Pad} */
    const pad = {
      leftKeyIsDown: leftButtonKey.isPressStart(), 
      rightKeyIsDown: rightButtonKey.isPressStart(),
      downKeyIsDown: keyIsDown(DOWN_ARROW),
      rotationButtonIsDown: upButtonKey.isPressStart()
    }
  
    tetris.tetrisEventListener = {
      onStateChange: (newState, lastState) => {
        console.log(`${newState.value} from ${lastState.value}`);
        tetrisDrawer.onStateChange(newState, lastState, tetris);
      },
      onTetrominoMove: (events) => {
        Object.keys(events).filter(k => events[k]).forEach(k => console.log(k));      
      }
    }
    tetris.update(pad);
  
    tetrisDrawer.draw(tetris);
    if(tetris.isGameOver) {
      tetrisDrawer.drawGameOver();
    }
  }
}


