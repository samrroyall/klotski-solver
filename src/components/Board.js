import React from 'react';
import Row from './Row';
import '../styles/Board.css';

const boardRows = 5;
const boardCols = 4;

// Function for checking overlap between placed blocks and initiating
// subsequent replacements.
function checkBlock(newBlock, blocks, onAddBlock) {
    let newBlocks = [];
    const t1 = newBlock.rowPos;
    const b1 = newBlock.rowPos + newBlock.numRows - 1;
    const l1 = newBlock.colPos;
    const r1 = newBlock.colPos + newBlock.numCols - 1;
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const t2 = block.rowPos;
        const b2 = block.rowPos + block.numRows - 1;
        const l2 = block.colPos;
        const r2 = block.colPos + block.numCols - 1;
        const bottomLeftOverlap = t2 >= t1 && t2 <= b1 && r2 >= l1 && r2 <= r1;
        const bottomRightOverlap = t2 >= t1 && t2 <= b1 && l2 >= l1 && l2 <= r1;
        const topLeftOverlap = t1 >= t2 && t1 <= b2 && l1 >= l2 && l1 <= r2;
        const topRightOverlap = t1 >= t2 && t1 <= b2 && r1 >= l2 && r1 <= r2;
        if (bottomLeftOverlap || bottomRightOverlap || topLeftOverlap || topRightOverlap) continue;
        newBlocks.push(block);
    }
    newBlocks.push(newBlock);
    onAddBlock(newBlocks);
}

// Function passed to the BoardCell component which will pass the rowPos and
// colPos information from the BoardCell where a DraggableBlock is dropped.
// This function uses that information and the DraggableBlock's numRows and
// numCols properties send from the Content component through the dragBlock
// property.
function onDrop(props, e) {
    // only drop a block if there is a block 
    // that has been dragged
    if (!props.dragBlock) return;

    const currRow = parseInt(e.currentTarget.id.split(",")[0]);
    const currCol = parseInt(e.currentTarget.id.split(",")[1]);
    const maxRow = currRow + props.dragBlock.numRows - 1;
    const maxCol = currCol + props.dragBlock.numCols - 1;

    if (maxRow < boardRows && maxCol < boardCols) {
        // instantiate new block
        const newBlock = { 
            rowPos: currRow, 
            colPos: currCol, 
            numRows: props.dragBlock.numRows,
            numCols: props.dragBlock.numCols
        };
        const size = newBlock.numRows*newBlock.numCols;
        const onWinningPos = newBlock.rowPos === props.winningRow && newBlock.colPos === props.winningCol;
        // if the fourBlock is not being placed on the winning position,
        // push newBlock to Content component to be fed back into Board via props
        if (size !== 4 || !onWinningPos) {  
            checkBlock(newBlock, props.blocks, props.onAddBlock); 
        }
    }
}

// function for displaying current board blocks
function getBlocks(blocks) {
    // initialize 2d array with no blocks
    let board = new Array(5); 
    for (let i = 0; i < boardRows; i++) {
        let tempRow = { id: i, row: new Array(4) }
        for (let j = 0; j < boardCols; j++) {
            const tempCell = {
                id: i.toString() + "," + j.toString(), 
                val: { numRows: 0, numCols: 0, rowPos: i, colPos: j }
            }
            tempRow.row[j] = tempCell;
        }
        board[i] = tempRow;
    }
    // insert blocks
    for (let b = 0; b < blocks.length; b++) {
        const currBlock = blocks[b];
        const lastCol = currBlock.colPos + currBlock.numCols - 1;      
        const lastRow = currBlock.rowPos + currBlock.numRows - 1;      
        for (let r = currBlock.rowPos; r <= lastRow; r++) {
            for (let c = currBlock.colPos; c <= lastCol; c++) {
                ((board[r].row)[c]).val = currBlock;
            }
        }
    }
    return board;
}

const boardMatrix = (props, rows) => (
    rows.map( (row) =>
        <Row key={row.id}
            cells={row.row}
            onClickFunc={(props.dragBlock ? (e) => onDrop(props, e) : props.onWinPosChange)}
            onDropFunc={(e) => onDrop(props, e)}
            winningRow={props.winningRow}
            winningCol={props.winningCol}
        />
    )
);

let Board = (props) => (
    <div className="p-0 mt-4 border" id="board">
        { boardMatrix(props, getBlocks(props.blocks)) }   
    </div>
);

export default Board;