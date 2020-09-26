import React from 'react';
import Solver from './solver.ts';
import './style.css';

function BoardBlock(props) {
  if (props.size === 4) {
    return (
      <div className="col-6 fourblock m-0 bg-danger border border-dark rounded"></div>
    );
  } else if (props.size === 2) {
    if (props.block.numCols === 1) {
        return (
          <div className="col-3 twoblockV m-0 bg-primary border border-dark rounded"></div>
        );
    } else if (props.block.numCols === 2) {
        return (
          <div className="col-6 twoblockH m-0 bg-warning border border-dark rounded"></div>
        );
    }
  } else if (props.size === 1) {
    return (
      <div className="col-3 oneblock m-0 bg-success border border-dark rounded"></div>
    );
  }
}

class BoardCell extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        currRow: parseInt(props.id.split(",")[0]),
        currCol: parseInt(props.id.split(",")[1])
    }
    this.click = this.click.bind(this);
  }

  click(e) {
    this.props.onClickFunc(e.currentTarget.id);
  }
  
  render() {
    // currently under placed block
    if (this.props.block == null) {
      return (
        <span></span>
      );
    // under overflow of placed block
    } else if (
      !this.props.block.hasOwnProperty("colPos") && 
      !this.props.block.hasOwnProperty("rowPos")
    ) {
      return (
        <div className="col-3 p-0 m-0"></div>
      );
    } else {
      const size = (
        this.props.block.hasOwnProperty("numCols") ? 
        this.props.block.numRows*this.props.block.numCols : 
        this.props.block.numRows*this.props.block.numRows
      );
      // empty space
      if (size === 0) {
        // winning cell
        if (
          (this.state.currRow === this.props.winningRow || this.state.currRow === this.props.winningRow+1) && 
          (this.state.currCol === this.props.winningCol || this.state.currCol === this.props.winningCol+1)
        ) {
          if (this.state.currRow === 4 || this.state.currCol === 3) {
            return (
              <div className="col-3 boardcell winningcell p-0 m-0 border"
                id={this.props.id}
                onMouseUp={this.props.onDropFunc}>
              </div>
            );
          } else {
            return (
              <div className="col-3 boardcell winningcell p-0 m-0 border"
                id={this.props.id}
                onMouseUp={this.props.onDropFunc}
                onMouseDown={this.click}>
              </div>
            );
          }
        // normal cell
        } else {
          if (this.state.currRow === 4 || this.state.currCol === 3) {
            return (
              <div className="col-3 boardcell p-0 m-0 border"
                id={this.props.id}
                onMouseUp={this.props.onDropFunc}>
              </div>
            );
          } else {
            return (
              <div className="col-3 boardcell p-0 m-0 border"
                id={this.props.id}
                onMouseUp={this.props.onDropFunc}
                onMouseDown={this.click}>
              </div>
            );
          }
        }
      // block placed
      } else {
        return (
          <BoardBlock
            key={this.props.id}
            size={size}
            block={this.props.block}
          />
        );
      }
    }
  }
}

function BoardRow(props) {
  const row = props.cells.map( (cell) =>
    <BoardCell
      key={cell.id}
      id={cell.id}
      block={cell.val}
      onDropFunc={props.onDropFunc}
      onClickFunc={props.onClickFunc}
      winningRow={props.winningRow}
      winningCol={props.winningCol}
    />
  );
  return (
    <div className="row boardrow p-0 m-0">
      {row}
    </div>
  );

}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: this.props.blocks,
      blocksAdded: false,
    };

    this.onDrop = this.onDrop.bind(this);
  }

  // Function passed to the BoardCell component which will pass the rowPos and
  // colPos information from the BoardCell where a DraggableBlock is dropped.
  // This function uses that information and the DraggableBlock's numRows and
  // numCols properties send from the Content component through the dragBlock
  // property.
  onDrop(e) {
    if (this.props.dragBlock) {
      // instantiate new block
      let newBlock = { 
        rowPos: parseInt(e.currentTarget.id.split(",")[0]), 
        colPos: parseInt(e.currentTarget.id.split(",")[1]), 
        numRows: this.props.dragBlock.numRows,
        numCols: this.props.dragBlock.numCols
      };
      let lastRow = newBlock.rowPos + newBlock.numRows - 1; // newBlock's max row
      let lastCol = newBlock.colPos + newBlock.numCols - 1; // newBlock's max column
      // ensure four block is not in the winning position
      if (
        newBlock.numRows*newBlock.numCols === 4 && 
        newBlock.rowPos === this.props.winningRow && 
        newBlock.colPos === this.props.winningCol
      ) {
        alert("The block of size 4 cannot be placed in the winning position");
      // ensure block does not fall off board
      } else if(lastRow > 4 || lastCol > 3) {
        alert("Invalid block placement");
      // ensure block of size 4 is not on the winning row
      } else {
        let newBlocks = this.state.blocks;
        newBlocks.push(newBlock);
        // push new block
        this.setState(state => ({
          blocksAdded: true,
          blocks: newBlocks
        }));
        this.props.onAddBlock(this.state.blocks);
      }
    }
  }

  // function for displaying current board blocks
  getBlocks(blocks) {
    // maintain sync between the current blocks in the Board component's state
    // and the blocks passed in by the Content component
    if (blocks !== this.state.blocks) {
      this.setState(state => ({
        blocks: blocks
      }));
    }
    const NoBlock = {
      numRows: 0,
      numCols: 0
    };
    // initialize 2d array with no blocks
    var board = new Array(5);
    for (var i = 0; i < 5; i++) {
      var tempRow = {
        id: i,
        row: new Array(4)
      }
      for (var j = 0; j < 4; j++) {
        var tempCell = {
          id: i.toString() + "," + j.toString(), 
          val: {
            numRows: 0,
            numCols: 0,
            rowPos: i,
            colPos: j,
          }
        }
        tempRow.row[j] = tempCell;
      }
      board[i] = tempRow;
    }
    // insert blocks
    for (var b = 0; b < blocks.length; b++) {
      var block = blocks[b];
      let lastRow = block.rowPos + block.numRows - 1;
      let lastCol = block.colPos + block.numCols - 1;      
      for (var r = block.rowPos; r <= lastRow; r++) {
        for (var c = block.colPos; c <= lastCol; c++) {
          if (r === block.rowPos && c === block.colPos) {
            ((board[r].row)[c]).val = block;
          } else if (r === block.rowPos){
            ((board[r].row)[c]).val = null;
          } else {
            ((board[r].row)[c]).val = NoBlock;
          }
        }
      }
    }
    return board;
  }

  render() { 
    const rows = this.getBlocks(this.props.blocks);
    const board = rows.map( (row) =>
      <BoardRow
        key={row.id}
        cells={row.row}
        onDropFunc={this.onDrop}
        onClickFunc={this.props.onClickFunc}
        winningRow={this.props.winningRow}
        winningCol={this.props.winningCol}
      />
    )
    return ( 
      <div className="p-0 mt-4 border" id="board">
        {board}   
      </div>
    );
  }
}

class DraggableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rel: null,
      pos: {
        left: 0,
        top: 0
      }
    };
    this.drag = this.drag.bind(this);
    this.move = this.move.bind(this);
    this.drop = this.drop.bind(this);
  }

  // function called on mouse down on a draggable block
  drag(e) {
    if (e.button !== 0) return
    var currPos = e.currentTarget.getBoundingClientRect();
    this.setState((state) => ({
      rel: {
        left: currPos.left,
        top: currPos.top
      }
    }));
    document.addEventListener("mousemove", this.move); // listen for mouse move
    document.addEventListener("mouseup", this.drop); // listen for mouse up (drop)
    this.props.onDragFunc(e.currentTarget.id); // send content the current block's ID
    e.stopPropagation();
    e.preventDefault();
  }
  
  // function called on mouse move after mouse down on a draggable block
  move(e) {
    var x = e.pageX;
    var y = e.pageY;
    this.setState((state) => ({
      pos: {
        left: x - this.state.rel.left,
        top: y - this.state.rel.top
      }
    }));
    e.stopPropagation();
    e.preventDefault();
  }


  // function called on mouse up after mouse down on a draggable block
  drop(e) {
    this.setState((state) => ({
      rel: null,
      pos: {
        left: 0,
        top: 0
      }
    }));
    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("mouseup", this.drop);
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    if (this.props.size === 4) {
      return (
        <div className="draggable-fourblock m-0 bg-danger border border-dark rounded draggable"
          id={this.props.id}
          style={{
            position: "relative",
            left: this.state.pos.left + "px",
            top: this.state.pos.top + "px"
          }}
          onMouseDown={this.drag}>
        </div>
      );
    } else if (this.props.size === 2) {
      if (this.props.block.numCols === 1) {
        return (
          <div className="draggable-twoblockV m-0 bg-primary border border-dark rounded draggable"
            id={this.props.id}
            style={{
              position: "relative",
              left: this.state.pos.left + "px",
              top: this.state.pos.top + "px"
            }}
            onMouseDown={this.drag}>
          </div>
        );
      } else if (this.props.block.numCols === 2) {
        return (
          <div className="draggable-twoblockH m-0 bg-warning border border-dark rounded draggable"
            id={this.props.id}
            style={{
              position: "relative",
              left: this.state.pos.left + "px",
              top: this.state.pos.top + "px"
            }}
            onMouseDown={this.drag}>
          </div>
        );
      }
    } else if (this.props.size === 1) {
      return (
        <div className="draggable-oneblock m-0 bg-success border border-dark rounded draggable"
          id={this.props.id}
          style={{
            position: "relative",
            left: this.state.pos.left + "px",
            top: this.state.pos.top + "px"
          }}
          onMouseDown={this.drag}>
        </div>
      );
    }
  }
}

function Toolbar(props) {
  // only show toolbar when board is cleared or blocks are being added
  if (props.show) {
    return (
      <div className="col-10 col-xl-4 mt-5">
        <div className="row justify-content-center">
          <DraggableBlock 
            size={4} 
            id="2,2"
            onDragFunc={props.onDragFunc}
          />
          <div className="mx-2"></div>
            <DraggableBlock 
              size={2} 
              id="2,1" 
              block={{ numRows: 2, numCols: 1 }} 
              onDragFunc={props.onDragFunc}
            />
        </div>
        <div className="row justify-content-center mt-3">
          <DraggableBlock 
            size={1} 
            id="1,1" 
            onDragFunc={props.onDragFunc}
          />
          <div className="mx-2"></div>
          <DraggableBlock 
            size={2} 
            id="1,2" 
            block={{ numRows: 1, numCols: 2 }} 
            onDragFunc={props.onDragFunc}
          />
        </div>
      </div>
    );
  } else {
    return <span></span>;
  }
}

function Buttons(props) {
  // button for clearing board
  const clearButton = (
    <button className="btn btn-danger mr-2" 
      onClick={props.onClear}>
        Clear
    </button>
  );
  // button for clearing a user made board
  const doubleClearButton = (
    <button className="btn btn-danger mr-2" 
      onClick={props.onDoubleClear}>
        Clear
    </button>
  );
  // button for displaying the default board
  const defaultButton = (
    <button className="btn btn-warning mx-1" 
      onClick={props.onDefault}>
        Default
    </button>
  );
  // button for running script to solve board
  const solveButton = (
    <button className="btn btn-primary ml-2" 
      onClick={props.onSolve}>
        Solve!
    </button>
  );
  // button to see previous move in solution
  const prevButton = (
    <button className="btn btn-danger mr-2" 
      onClick={props.onPrev}
      id="prev-btn">
        Prev
    </button>
  );
  //button to see next move in solution
  const nextButton = (
    <button className="btn btn-warning mx-2" 
      onClick={props.onNext}>
        Next
    </button>
  );
  // button to finalize moves in solution
  const finishButton = (
    <button className="btn btn-success ml-2" 
      onClick={props.onFinish}>
        Finish
    </button>
  );
  
  // buttons displayed after solve button is pressed
  if (props.solved) {
    return (
      <div className="text-center mt-3">
        {prevButton}
        {nextButton}
        {finishButton}
      </div>
    );
  // buttons displayed after blocks have been dropped
  } else if (props.blocksAdded){
    return (
      <div className="text-center mt-3">
        {doubleClearButton}
        {solveButton}
      </div>
    );
  // buttons displayed when board is cleared of blocks
  } else if (props.cleared){
    return (
      <div className="text-center mt-3">
        {defaultButton}
        {solveButton}
      </div>
    );
  // buttons displayed when default board is shown
  } else if (props.finished) {
    return <span></span>;
  } else {
    return (
      <div className="text-center mt-3">
        {clearButton}
        {solveButton}
      </div>
    );
  }
}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      blocksAdded: false,
      cleared: true,
      displayText: "Klotski Solver",
      default: false,
      solved: false,
      finished: false,
      dragBlock: null,
      winningRow: 3,
      winningCol: 1
    };

    this.blocksAdded = this.blocksAdded.bind(this);
    this.clear = this.clear.bind(this);
    this.doubleClear = this.doubleClear.bind(this);
    this.default = this.default.bind(this);
    this.solve = this.solve.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.restart = this.restart.bind(this);
    this.finish = this.finish.bind(this);
    this.dragBlockInfo = this.dragBlockInfo.bind(this);
    this.clearDragBlock = this.clearDragBlock.bind(this);
    this.setWinningPos = this.setWinningPos.bind(this);
  }

  // Function passed to the Board component that updates the Content
  // blocksAdded state property when a user adds a block to the board.
  blocksAdded(blocks) {
    this.setState(state => ({
      blocks: blocks,
      blocksAdded: true,
      cleared: false,
      default: false
    }))
  }

  // Function passed to the Buttons component that updates the Content
  // cleared state property when a user clicks the clear button.
  clear() {
    this.setState(state => ({
      blocks: [],
      blocksAdded: false,
      cleared: true,
      default: false,
      displayText: "Klotski Solver",
      solved: false,
      finished: false,
      dragBlock: null,
      winningRow: 3,
      winningCol: 1
    }));
  }

  // Function passed to the Buttons component that calls `clear()` and 
  // updates the Content doubleCleared state state property when a user 
  // clicks the doubleClear button.
  doubleClear() {
    this.clear();
  }

  restart() {
    let clearFunc = this.clear;
    setTimeout(
      function () {clearFunc()},
      3000
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
      let solutionMoves = s.getBoards();
      const numMoves = solutionMoves.length;
      if (numMoves === 0) {
        this.setState(state => ({
          displayText: "No Solution Found :("
        }));
        this.restart();
      } else {
        this.setState(state => ({
          blocksAdded: false,
          cleared: false,
          default: false,
          displayText: "Solution of Length " + numMoves.toString() + " Found!",
          boards: solutionMoves,
          boardIdx: -1,
          solved: true
        }));
      }
    } catch (err) {
      alert(err);
    }
  }

  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the next button.
  next() {
    if (this.state.boards.length === 0) {
      return;
    } else {
      if (this.state.boardIdx === this.state.boards.length-1) {
        this.setState(state => ({
          displayText: "You Win!"
        }));
        this.restart();    
      } else {
        this.setState(state => ({
          blocks: this.state.boards[this.state.boardIdx + 1],
          boardIdx: this.state.boardIdx + 1,
          displayText: "Move " + (this.state.boardIdx+2).toString()
        }));
      }
    }
  }

  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the prev button.
  prev() {
     if (this.state.boards.length === 0) {
      return;
    } else {
      if (this.state.boardIdx === -1) {
        return;
      } else {
        this.setState(state => ({
          blocks: this.state.boards[this.state.boardIdx - 1],
          boardIdx: this.state.boardIdx - 1,
          displayText: (this.state.boardIdx <= 0 ? "Klotski Solver" : "Move " + this.state.boardIdx.toString())
        }));
      }
    }
  }

  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the next button.
  finish() {
    this.setState(state => ({ 
      solved: false,
      finished: true 
    }));
    let i = this.state.boardIdx;
    let n = this.state.boards.length;
    let callFunction = this.next;
    // repeat calls to next with a .5 second interval
    var repeater = setInterval(function () {
      if (i < n) {
        callFunction();
        i++;
      } else {
        clearInterval(repeater);
      }
    }, 250);
  }


  // Function passed to the Buttons component that updates the Content
  // default state property when a user clicks the default button.
  default() {
    const initialBlocks = [
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
    this.setState(state => ({
      blocks: initialBlocks,
      blocksAdded: false,
      cleared: false,
      default: true,
      winningRow: 3,
      winningCol: 1
    }));
  }

  // Function passed to the Toolbar component (onDragFunc) which alerts the Content
  // component when a DraggableBlock is being dragged and send the block's 
  // corresponding ID which contains the block's numRows and numCols properties.
  // This information is used to update the Content dragBlock state property, which
  // is passed to the Board component.
  dragBlockInfo(id) {
    this.setState(state => ({
      dragBlock: {
        numRows: parseInt(id.split(",")[0]),
        numCols: parseInt(id.split(",")[1])
      }
    }));
  } 

  setWinningPos(id) {
    if (this.state.cleared) {
      this.setState(state => ({
        winningRow: parseInt(id.split(",")[0]),
        winningCol: parseInt(id.split(",")[1])
      }));
    }
  }

  // Function passed to the Board component on mouse down, which is used to nullify
  // the Content dragBlock state property.
  clearDragBlock(e) {
    this.setState(state => ({
      dragBlock: null
    }));
  }

  render() {
    return (
      <div id="content-wrapper">
        <div className="h1 text-center mt-1 mb-0" id="header">
          {this.state.displayText} 
        </div>
        <div className="row justify-content-center px-0 mx-0"
          onMouseDown={this.clearDragBlock}>
          <div className="col-4 board">
            <Board 
              blocks={this.state.blocks}
              dragBlock={this.state.dragBlock}
              onAddBlock={this.blocksAdded}
              onClickFunc={this.setWinningPos}
              winningRow={this.state.winningRow}
              winningCol={this.state.winningCol}
            />
            <Buttons 
              blocksAdded={this.state.blocksAdded}
              cleared={this.state.cleared}
              finished={this.state.finished}
              solved={this.state.solved}
              onClear={this.clear}
              onDoubleClear={this.doubleClear}
              onDefault={this.default}
              onFinish={this.finish}
              onNext={this.next}
              onPrev={this.prev}
              onSolve={this.solve}
            />
          </div>
          <Toolbar 
            show={this.state.cleared || this.state.blocksAdded}
            onDragFunc={this.dragBlockInfo}
          />
        </div>
        <div className="text-center text-secondary" id="footer">
          Developed by Sam Royall
        </div>
      </div>
    );   
  }
}

function App() {
  return (
    <Content />   
  );
}

export default App;