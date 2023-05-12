import p5Types from "p5";
import { useState } from "react";
import Sketch from "react-p5";
import { Maze } from "../classes/maze";

export default function App() {

  const [confirm, setConfirm] = useState<boolean>(false);
  const [maze, setMaze] = useState<Maze>();
  const [mazeSize, setMazeSize] = useState<number>(30);
  const [isPathDisplayed, setIsPathDisplayed] = useState<boolean>(false);
  const [classicInOut, setClassicInOut] = useState<boolean>(false);

  const setup = (p5: p5Types, canvasParentRef: p5Types.Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);

    const _maze = new Maze(p5, mazeSize);

    _maze.generate();
    _maze.createEntry(classicInOut);
    _maze.createExit(classicInOut);
    _maze.initGame(_maze.getEntry());

    setMaze(_maze);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);

    if (maze) {
      maze.draw();
      maze.drawPlayer();
      if (isPathDisplayed) {
        maze.drawPath();
      }
      maze.moveInside(maze.getExit());
    }

  };

  return (
    <>
      {confirm ? <Sketch setup={setup} draw={draw} /> : null}
      <fieldset>
        <legend>Options</legend>
        <div>
          <label>Maze size</label>
          <div>
            <label>10</label>
            <input type="range" min="10" max="50" step="2" value={mazeSize} onChange={(e) => setMazeSize(parseInt(e.target.value))} />
            <label>50</label>
          </div>
        </div>
        <div>
          <label>Show user path</label>
          <input type="checkbox" onClick={() => setIsPathDisplayed(prev => !prev)} />
        </div>
        <div>
          <label>Classic entry/exit</label>
          <input type="checkbox" onClick={() => setClassicInOut(prev => !prev)}/>
        </div>
        <div>
          <button onClick={() => setConfirm(true)}>Confirm</button>
        </div>
      </fieldset>
    </>
  );
}
