import React from 'react';
import Alert from './Alert';
import Board from './Board';
import Buttons from './Buttons';
import Toolbar from './Toolbar';
import Solver from '../solver.ts';
import '../styles/global.css';

const boardRows = 5;
const boardCols = 4;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      currState: "cleared",
      displayText: "Klotski Solver",
      dragBlock: null,
      winningRow: 3,
      winningCol: 1
    };

    this.addBlock = this.addBlock.bind(this);
    this.clear = this.clear.bind(this);
    this.default = this.default.bind(this);
    this.dragBlockInfo = this.dragBlockInfo.bind(this);
    this.finish = this.finish.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.restart = this.restart.bind(this);
    this.setWinningPos = this.setWinningPos.bind(this);
    this.solve = this.solve.bind(this);
  }
  

  // BUTTON STATE FUNCTIONS


  // Function passed to the Buttons component that updates the Content
  // cleared state property when a user clicks the clear button.
  clear() {
    this.setState(() => ({
      blocks: [],
      currState: "cleared",
      displayText: "Klotski Solver",
      dragBlock: null,
      winningRow: 3,
      winningCol: 1
    }));
  }
  // Function passed to the Buttons component that updates the Content
  // default state property when a user clicks the default button.
  default() {
    const defaultBlocks = [
      { rowPos: 0, colPos: 0, numRows: 2, numCols: 1 },
      { rowPos: 0, colPos: 1, numRows: 2, numCols: 2 },
      { rowPos: 0, colPos: 3, numRows: 2, numCols: 1 },
      { rowPos: 2, colPos: 0, numRows: 2, numCols: 1 },
      { rowPos: 2, colPos: 1, numRows: 1, numCols: 2 },
      { rowPos: 2, colPos: 3, numRows: 2, numCols: 1 },
      { rowPos: 3, colPos: 1, numRows: 1, numCols: 1 },
      { rowPos: 3, colPos: 2, numRows: 1, numCols: 1 },
      { rowPos: 4, colPos: 0, numRows: 1, numCols: 1 },
      { rowPos: 4, colPos: 3, numRows: 1, numCols: 1 }
    ]
    this.setState(() => ({
      blocks: defaultBlocks,
      currState: "default",
      winningRow: 3,
      winningCol: 1
    }));
  }


  // DRAG-N-DROP FUNCTIONS


  // Function passed to the Board component that updates the Content
  // blocksAdded state property when a user adds a block to the board.
  addBlock(newBlocks) {
    this.setState(() => ({
      blocks: newBlocks,
      currState: "blocksAdded",
    }))
  }
  // Function passed to the Toolbar component (onDragFunc) which alerts the Content
  // component when a DraggableBlock is being dragged and send the block's 
  // corresponding ID which contains the block's numRows and numCols properties.
  // This information is used to update the Content dragBlock state property, which
  // is passed to the Board component.
  dragBlockInfo(id) {
    this.setState(() => ({
      dragBlock: {
        numRows: parseInt(id.split(",")[0]),
        numCols: parseInt(id.split(",")[1])
      }
    }));
  }


  // BOARD SOLVING FUNCTIONS


  // function for clearing the board after the solution is finished
  restart() {
    const clearFunc = this.clear;
    setTimeout(
      function () {clearFunc()},
      3000
    );
  }
  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the next button.
  next() {
    if (this.state.boards.length === 0) return;
    if (this.state.boardIdx === this.state.boards.length-1) {
      this.setState(() => ({
        currState: "finished",
        displayText: "You Win!"
      }));
      this.restart();    
    } else {
      this.setState((state) => ({
        blocks: state.boards[state.boardIdx + 1],
        boardIdx: state.boardIdx + 1,
        displayText: "Move " + (state.boardIdx+2).toString()
      }));
    }
  }
  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the prev button.
  prev() {
    if (this.state.boards.length === 0 || this.state.boardIdx === -1) return;
    this.setState(state => ({
      blocks: state.boards[state.boardIdx - 1],
      boardIdx: state.boardIdx - 1,
      displayText: (state.boardIdx <= 0 ? "Klotski Solver" : "Move " + state.boardIdx.toString())
    }));
  }
  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the next button.
  finish() {
    this.setState(() => ({ currState: "finished" }));
    // repeat calls to next with a .5 second interval
    const callFunc = this.next;
    const n = this.state.boards.length;
    let i = this.state.boardIdx;
    var repeater = setInterval( 
      function () {
        if (i < n) {
          callFunc();
          i++;
        } else {
          clearInterval(repeater);
        }
      }, 250
    );
  }
  // Function passed to the Buttons component that updates the Content
  // solved state property when a user clicks the solve button.
  solve() {
    try {
      var s = new Solver(
        this.state.blocks, 
        this.state.winningRow, 
        this.state.winningCol
      );
      s.solve();
    } catch (err) {
      alert(err);
      return;
    }
    this.setState(() => ({ currState: "solved" }));
    const solutionMoves = s.getBoards();
    const numMoves = solutionMoves.length;
    if (numMoves === 0) {
      this.setState(() => ({displayText: "No Solution Found :(" }));
      this.restart();
    } else {
      this.setState(() => ({
        displayText: "Solution of Length " + numMoves.toString() + " Found!",
        boards: solutionMoves,
        boardIdx: -1
      }));
    }
  }

  // function sent to BoardCell for moving the winning position
  setWinningPos(e) {
    const id = e.currentTarget.id;
    const winRow = parseInt(id.split(",")[0]);
    const winCol = parseInt(id.split(",")[1]);
    if (winRow < boardRows - 1 && winCol < boardCols - 1) {
      if (this.state.currState === "cleared") {
        this.setState(() => ({
          winningRow: winRow,
          winningCol: winCol 
        }));
      }
    }
  }

  render() {
    const header = (
      <header className="h1 text-center mt-1 mb-0">
        {this.state.displayText}
      </header>
    );
    const footer = (
      <footer className="mt-5 text-center text-secondary">
        © Sam Royall. All Rights Reserved.
      </footer>
    );
    let showToolbar = (
      this.state.currState === "cleared" ||
      this.state.currState === "blocksAdded"
    );

    return (
      <>
        <Alert />
        {header} 
        <div className="row justify-content-center px-0 mx-0">
          <div className="col-3 board">
            <Board blocks={this.state.blocks}
              dragBlock={this.state.dragBlock}
              winningRow={this.state.winningRow}
              winningCol={this.state.winningCol}
              onAddBlock={this.addBlock}
              onWinPosChange={this.setWinningPos}
            />
            <Buttons state={this.state.currState}
              onClear={this.clear}
              onDefault={this.default}
              onFinish={this.finish}
              onNext={this.next}
              onPrev={this.prev}
              onSolve={this.solve}
            />
          </div>
          <Toolbar 
            show={showToolbar}
            onDragFunc={this.dragBlockInfo}
          />
        </div>
        {footer} 
      </>
    );   
  }
}

export default App;