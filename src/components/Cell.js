import React from 'react';
import Block from './Block';
import '../styles/Cell.css';

function emptyCell(props) {
    const currRow = parseInt(props.id.split(",")[0]);
    const currCol = parseInt(props.id.split(",")[1]);
    const classString = (
        (currRow !== props.winningRow && currRow !== props.winningRow+1) || (currCol !== props.winningCol && currCol !== props.winningCol+1)
        ? "col-3 boardcell p-0 m-0 border"
        : "col-3 boardcell winningcell p-0 m-0 border"
    );
    return (
        <div className={classString}
            id={props.id}
            onMouseUp={props.onDropFunc}
            onMouseDown={(e) => props.onClickFunc(e)}
        />
    );
}

const coveredCell = (props) => (
    <Block
        key={props.id}
        id={props.id}
        block={props.block}
        currRow={parseInt(props.id.split(",")[0])}
        currCol={parseInt(props.id.split(",")[1])}
        size={props.block.numRows*props.block.numCols}
        onDropFunc={props.onDropFunc}
        onClickFunc={(e) => props.onClickFunc(e)}
    />
);

let Cell = (props) => (
    props.block.numRows*props.block.numCols === 0
    ? emptyCell(props)
    : coveredCell(props)
);

export default Cell;