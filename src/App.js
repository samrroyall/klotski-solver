import React from 'react';
import Solver from './solver.ts';
import './style.css';

function BoardBlock(props) {
  const oneblock =  "col-3 boardblock p-0 m-0 bg-success border border-dark rounded";
  const twoblockV = "col-3 boardblock p-0 m-0 bg-primary border border-dark";
  const twoblockH = "col-3 boardblock p-0 m-0 bg-warning border border-dark";
  const fourblock = "col-3 boardblock p-0 m-0 bg-danger border border-dark"

  let classString = "";
  if (props.size === 1) {
    classString = oneblock;
  } else if (props.size === 2 && props.block.numCols === 1) {
    if (props.currRow === props.block.rowPos) {
      classString = twoblockV + " border-bottom-0 rounded-top";
    } else {
      classString = twoblockV + " border-top-0 rounded-bottom"
    }
  } else if (props.size === 2) {
    if (props.currCol === props.block.colPos) {
      classString = twoblockH + " border-right-0 rounded-left";
    } else {
      classString = twoblockH + " border-left-0 rounded-right";
    }
  } else if (props.size === 4) {
    if (props.currCol === props.block.colPos && props.currRow === props.block.rowPos) {
      classString = fourblock + " border-right-0 border-bottom-0 rounded-top-left";
    } else if (props.currCol === props.block.colPos && props.currRow !== props.block.rowPos) {
      classString = fourblock + " border-right-0 border-top-0 rounded-bottom-left";
    } else if (props.currCol !== props.block.colPos && props.currRow === props.block.rowPos) {
      classString = fourblock + " border-left-0 border-bottom-0 rounded-top-right";
    } else {
      classString = fourblock + " border-left-0 border-top-0 rounded-bottom-right";
    }
  } else {
    alert("Invalid board cell properties");
  }

  return (
    <div className={classString}
      id={props.id}
      onMouseUp={props.onDropFunc}
      onMouseDown={props.onClickFunc}
      >
    </div>

  );
}

function BoardCell (props) {
  // function for calling parent setWinningPos function
  function click(e) {
    props.onClickFunc(e);
  }

  var currRow = parseInt(props.id.split(",")[0]);
  var currCol = parseInt(props.id.split(",")[1]);
  var size = props.block.numRows*props.block.numCols;

  const winCell = (
      <div className="col-3 boardcell winningcell p-0 m-0 border"
        id={props.id}
        onMouseUp={props.onDropFunc}
        onMouseDown={click}>
      </div>
    );
  const cell = (
    <div className="col-3 boardcell p-0 m-0 border"
      id={props.id}
      onMouseUp={props.onDropFunc}
      onMouseDown={click}>
    </div>
  );

  if (size === 0) {
    // winning cell
    let winRow = props.winningRow;
    let winCol = props.winningCol;
    if ((currRow === winRow || currRow === winRow+1) && (currCol === winCol || currCol === winCol+1)) {
      return winCell;
    // normal cell
    } else {
      return cell;
    }
  // block placed
  } else {
    return (
      <BoardBlock
        key={props.id}
        id={props.id}
        block={props.block}
        currCol={currCol}
        currRow={currRow}
        size={size}
        onDropFunc={props.onDropFunc}
        onClickFunc={click}
      />
    );
  }
}

function BoardRow(props) {
  const row = props.cells.map((cell) =>
    <BoardCell
      key={cell.id}
      id={cell.id}
      block={cell.val}
      onClickFunc={props.onClickFunc}
      onDropFunc={props.onDropFunc}
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

function Board(props) {
  // Function for checking overlap between placed blocks and initiating
  // subsequent replacements.
  function checkBlock(newBlock) {
    var newBlocks = [];
    var t1 = newBlock.rowPos;
    var b1 = newBlock.rowPos + newBlock.numRows - 1;
    var l1 = newBlock.colPos;
    var r1 = newBlock.colPos + newBlock.numCols - 1;
    for (var i = 0; i < props.blocks.length; i++) {
      var block = props.blocks[i];
      var t2 = block.rowPos;
      var b2 = block.rowPos + block.numRows - 1;
      var l2 = block.colPos;
      var r2 = block.colPos + block.numCols - 1;
      var overlap = ( 
        // bottom-right/top-left overlap
        (t2 >= t1 && t2 <= b1 && l2 >= l1 && l2 <= r1) ||
        (t1 >= t2 && t1 <= b2 && l1 >= l2 && l1 <= r2) ||
        // top-right/bottom-left overlap 
        (t1 >= t2 && t1 <= b2 && r1 >= l2 && r1 <= r2) ||
        (t2 >= t1 && t2 <= b1 && r2 >= l1 && r2 <= r1)
      );        
      if (!overlap) newBlocks.push(block);
    }
    newBlocks.push(newBlock);
    props.onAddBlock(newBlocks);
  }
  // Function passed to the BoardCell component which will pass the rowPos and
  // colPos information from the BoardCell where a DraggableBlock is dropped.
  // This function uses that information and the DraggableBlock's numRows and
  // numCols properties send from the Content component through the dragBlock
  // property.
  function onDrop(e) {
    if (props.dragBlock) {
      let currRow = parseInt(e.currentTarget.id.split(",")[0]);
      let currCol = parseInt(e.currentTarget.id.split(",")[1]);
      let maxRow = currRow + props.dragBlock.numRows - 1;
      let maxCol = currCol + props.dragBlock.numCols - 1;
      if (maxRow < props.boardRows && maxCol < props.boardCols) {
        // instantiate new block
        var newBlock = { 
          rowPos: currRow, 
          colPos: currCol, 
          numRows: props.dragBlock.numRows,
          numCols: props.dragBlock.numCols
        };
        // cannot place fourblock in winning position
        if (
          !(newBlock.numRows*newBlock.numCols === 4 && 
            newBlock.rowPos === props.winningRow && 
            newBlock.colPos === props.winningCol)
        ) {
          // push newBlocks to Content component to be fed back into Board via props
          checkBlock(newBlock);
        }
      }
    }
  }
  // function for displaying current board blocks
  function getBlocks() {
    // initialize 2d array with no blocks
    var board = new Array(5); 
    for (var i = 0; i < props.boardRows; i++) {
      var tempRow = { id: i, row: new Array(4) }
      for (var j = 0; j < props.boardCols; j++) {
        var tempCell = {
          id: i.toString() + "," + j.toString(), 
          val: { numRows: 0, numCols: 0, rowPos: i, colPos: j }
        }
        tempRow.row[j] = tempCell;
      }
      board[i] = tempRow;
    }
    // insert blocks
    for (var b = 0; b < props.blocks.length; b++) {
      var block = props.blocks[b];
      let lastCol = block.colPos + block.numCols - 1;      
      let lastRow = block.rowPos + block.numRows - 1;      
      for (var r = block.rowPos; r <= lastRow; r++) {
        for (var c = block.colPos; c <= lastCol; c++) {
          ((board[r].row)[c]).val = block;
        }
      }
    }
    return board;
  }

  const rows = getBlocks();
  const board = rows.map((row) =>
    <BoardRow
      key={row.id}
      cells={row.row}
      onClickFunc={(props.dragBlock ? onDrop : props.moveWinPos)}
      onDropFunc={onDrop}
      winningRow={props.winningRow}
      winningCol={props.winningCol}
    />
  )

  return ( 
    <div className="p-0 mt-4 border" id="board">
      {board}   
    </div>
  );
}

class DraggableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rel: null,
      pos: { left: 0, top: 0}
    };
    this.click = this.click.bind(this);
    this.move = this.move.bind(this);
    this.drop = this.drop.bind(this);
  }

  // function called on mouse down on a draggable block
  click(e) {
    if (e.button !== 0) return
    let currPos = e.currentTarget.getBoundingClientRect();
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
    let x = e.pageX;
    let y = e.pageY;
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
      pos: {left: 0, top: 0}
    }));
    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("mouseup", this.drop);
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    // dragblock vars
    const steez = {
      position: "relative",
      left: this.state.pos.left + "px",
      top: this.state.pos.top + "px"
    };
    const oneblockString  = "draggable-oneblock  draggable m-2 p-0 bg-success border border-dark rounded";
    const twoblockHString = "draggable-twoblockH draggable m-2 p-0 bg-warning border border-dark rounded";
    const twoblockVString = "draggable-twoblockV draggable m-2 p-0 bg-primary border border-dark rounded";
    const fourblockString = "draggable-fourblock draggable m-2 p-0 bg-danger  border border-dark rounded";
    let classString = "";
    // check block size
    if (this.props.size === 4) classString = fourblockString;
    else if (this.props.size === 2 && this.props.block.numCols === 1) classString = twoblockVString;
    else if (this.props.size === 2) classString = twoblockHString;
    else if (this.props.size === 1) classString = oneblockString;
    else alert("Invalid draggable block properties");
    // return dragblock
    return (
      <div className={classString}
        id={this.props.id}
        style={steez}
        onMouseDown={this.click}>
      </div>
    );
  }
}

function Toolbar(props) {
  // only show toolbar when board is cleared or blocks are being added
  if (props.show) {
    return (
      <div className="col-12 mt-2">
        <div className="row justify-content-center">
          <DraggableBlock 
            size={4} 
            id="2,2"
            onDragFunc={props.onDragFunc}
          />
          <DraggableBlock 
            size={2} 
            id="2,1" 
            block={{ numRows: 2, numCols: 1 }} 
            onDragFunc={props.onDragFunc}
          />
          <DraggableBlock 
            size={2} 
            id="1,2" 
            block={{ numRows: 1, numCols: 2 }} 
            onDragFunc={props.onDragFunc}
          />
          <DraggableBlock 
            size={1} 
            id="1,1" 
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
    <button className="btn btn-sm btn-danger mr-2" 
      onClick={props.onClear}>
        Clear
    </button>
  );
  // button for displaying the default board
  const defaultButton = (
    <button className="btn btn-sm btn-warning mx-1" 
      onClick={props.onDefault}>
        Default
    </button>
  );
  // button to finalize moves in solution
  const finishButton = (
    <button className="btn btn-sm btn-success ml-2" 
      onClick={props.onFinish}>
        Finish
    </button>
  );
  //button to see next move in solution
  const nextButton = (
    <button className="btn btn-sm btn-warning mx-2" 
      onClick={props.onNext}>
        Next
    </button>
  );
  // button to see previous move in solution
  const prevButton = (
    <button className="btn btn-sm btn-danger mr-2" 
      onClick={props.onPrev}
      id="prev-btn">
        Prev
    </button>
  );
  // button for running script to solve board
  const solveButton = (
    <button className="btn btn-sm btn-primary ml-2" 
      onClick={props.onSolve}>
        Solve!
    </button>
  );
  
  // buttons displayed after last solution move is seen 
  if (props.state === "finished") {
    return <span></span>;
  // buttons displayed after solve button is pressed
  } else if (props.state === "solved") {
    return (
      <div className="text-center mt-2">
        {prevButton}
        {nextButton}
        {finishButton}
      </div>
    );
  // buttons displayed after blocks have been dropped
  } else if (props.state === "blocksAdded"){
    return (
      <div className="text-center mt-2">
        {clearButton}
        {solveButton}
      </div>
    );
  // buttons displayed when board is cleared of blocks
  } else if (props.state === "cleared"){
    return (
      <div className="text-center mt-2">
        {defaultButton}
        {solveButton}
      </div>
    );
  // buttons displayed when default board is shown
  } else if (props.state === "default") {
    return (
      <div className="text-center mt-2">
        {clearButton}
        {solveButton}
      </div>
    );
  } else {
    return <span></span>;
  }
}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      currState: "cleared",
      displayText: "Klotski Solver",
      dragBlock: null,
      boardRows: 5,
      boardCols: 4,
      winningRow: 3,
      winningCol: 1
    };

    this.blocksAdded = this.blocksAdded.bind(this);
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
    this.setState(state => ({
      blocks: [],
      currState: "cleared",
      displayText: "Klotski Solver",
      dragBlock: null,
      boardRows: 5,
      boardCols: 4,
      winningRow: 3,
      winningCol: 1
    }));
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
      currState: "default",
      boardRows: 5,
      boardCols: 4,
      winningRow: 3,
      winningCol: 1
    }));
  }


  // DRAG-N-DROP FUNCTIONS


  // Function passed to the Board component that updates the Content
  // blocksAdded state property when a user adds a block to the board.
  blocksAdded(newBlocks) {
    this.setState(state => ({
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
    this.setState(state => ({
      dragBlock: {
        numRows: parseInt(id.split(",")[0]),
        numCols: parseInt(id.split(",")[1])
      }
    }));
  }


  // BOARD SOLVING FUNCTIONS


  // function for clearing the board after the solution is finished
  restart() {
    let clearFunc = this.clear;
    setTimeout(
      function () {clearFunc()},
      3000
    );
  }
  // Function passed to the Buttons component that updates the Content
  // boards and blocks state properties when a user clicks the next button.
  next() {
    if (this.state.boards.length === 0) {
      return;
    } else {
      if (this.state.boardIdx === this.state.boards.length-1) {
        this.setState(state => ({
          currState: "finished",
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
    this.setState(state => ({ currState: "finished" }));
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
    this.setState(state => ({ currState: "solved" }));
    const solutionMoves = s.getBoards();
    const numMoves = solutionMoves.length;
    if (numMoves === 0) {
      this.setState(state => ({displayText: "No Solution Found :(" }));
      this.restart();
    } else {
      this.setState(state => ({
        displayText: "Solution of Length " + numMoves.toString() + " Found!",
        boards: solutionMoves,
        boardIdx: -1
      }));
    }
    
  }


  // OTHER FUNCTIONS


  // function sent to BoardCell for moving the winning position
  setWinningPos(e) {
    let id = e.currentTarget.id;
    let winRow = parseInt(id.split(",")[0]);
    let winCol = parseInt(id.split(",")[1]);
    if (winRow < this.state.boardRows - 1 && winCol < this.state.boardCols - 1) {
      if (this.state.currState === "cleared") {
        this.setState(state => ({
          winningRow: winRow,
          winningCol: winCol 
        }));
      }
    }
  }

  render() {
    return (
      <div id="content-wrapper">
        <div className="h1 text-center mt-1 mb-0" id="header">
          {this.state.displayText} 
        </div>
        <div className="row justify-content-center px-0 mx-0">
          <div className="col-3 board">
            <Board 
              blocks={this.state.blocks}
              boardRows={this.state.boardRows}
              boardCols={this.state.boardCols}
              dragBlock={this.state.dragBlock}
              onAddBlock={this.blocksAdded}
              moveWinPos={this.setWinningPos}
              winningRow={this.state.winningRow}
              winningCol={this.state.winningCol}
            />
            <Buttons 
              state={this.state.currState}
              onClear={this.clear}
              onDefault={this.default}
              onFinish={this.finish}
              onNext={this.next}
              onPrev={this.prev}
              onSolve={this.solve}
            />
          </div>
          <Toolbar 
            show={this.state.currState === "cleared" || this.state.currState === "blocksAdded"}
            onDragFunc={this.dragBlockInfo}
          />
        </div>
        <div className="mt-5 text-center text-secondary" id="footer">
          Developed by Sam Royall
        </div>
      </div>
    );   
  }
}

function Alert() {
  function removeOverlay() {
    document.getElementById("overlay").classList.add("hide");
  }

  const instructionsAlert = (
    <div id="overlay">
      <div className="alert alert-danger alert-dismissible fade show alert-body"
        role="alert">
            <button type="button" 
              className="close alert-button"
              data-dismiss="alert"
              aria-label="close"
              onClick={removeOverlay}>
                <span aria-hidden="true">&times;</span>
            </button>
            <div className="h4">Welcome to the Klotski Solver!</div>
            <hr/>
            The goal of Klotski is to create a board with <strong>one</strong> red block and 
            <strong> two</strong> empty spaces and attempt to move the red block to the winning 
            position (the pink spaces) in as few moves as possible.
            <hr/>
            First, click on the board to set your winning position. 
            <br/><br/>
            Next, drag-and-drop (desktop only) or click-to-select and click-to-place blocks
            on the board.
            <br/><br/>
            Finally, click 'Solve' and watch our super cool algorithm find an optimal solution
            to your board. Step though the solution by pressing 'Next' or 'Prev', or simply
            press 'Finish' and watch as the board is solved before your eyes.
      </div>
    </div>
  );

  return instructionsAlert;
}

function App() {
  return (
    <div>
      <Alert />
      <Content />   
    </div>
  );
}

export default App;