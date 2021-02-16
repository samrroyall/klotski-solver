import React from 'react';
import '../styles/Block.css';

const oneblock =  "col-3 boardblock p-0 m-0 bg-success border border-dark rounded";
const twoblockV = "col-3 boardblock p-0 m-0 bg-primary border border-dark";
const twoblockH = "col-3 boardblock p-0 m-0 bg-warning border border-dark";
const fourblock = "col-3 boardblock p-0 m-0 bg-danger border border-dark"

function getClassStr(block, currRow, currCol) {
    let classString = "";
    const size = block.numRows*block.numCols;
    if (size === 1) {
        classString += oneblock;
    } else if (size === 2 && block.numCols === 1) {
        classString += twoblockV;
        classString += (
            currRow === block.rowPos 
            ? " border-bottom-0 rounded-top"
            : " border-top-0 rounded-bottom"
        );
    } else if (size === 2) {
        classString += twoblockH;
        classString += (
            currCol === block.colPos 
            ? " border-right-0 rounded-left" 
            : " border-left-0 rounded-right"
        );
    } else if (size === 4) {
        classString += fourblock;
        // remove top or bottom border depending on cell row
        // set first half of rounded border class
        classString += (
            currRow === block.rowPos
            ? " border-bottom-0 rounded-top"
            : " border-top-0 rounded-bottom"
        )
        // complete rounded border class
        // remove right or left border depending on cell column
        classString += (
            currCol === block.colPos
            ? "-left border-right-0"
            : "-right border-left-0"
        )
    } else {
        alert("Invalid board block properties");
        return;
    }
    return classString;
}

let Block = (props) => (
    <div className={getClassStr(props.block, props.currRow, props.currCol)}
        id={props.id}
        onMouseUp={props.onDropFunc}
        onMouseDown={props.onClickFunc}
    />
);

export default Block;