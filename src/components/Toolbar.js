import React from 'react';
import DraggableBlock from './DraggableBlock';

const oneBlock = (f) => (  
    <DraggableBlock size={1} id="1,1" onDragFunc={f} /> 
);
const fourBlock = (f) => ( 
    <DraggableBlock size={4} id="2,2" onDragFunc={f} /> 
);
const twoBlockV = (f) => ( 
    <DraggableBlock size={2} id="2,1" onDragFunc={f} block={{ numRows: 2, numCols: 1 }} /> 
);
const twoBlockH = (f) => ( 
    <DraggableBlock size={2} id="1,2" onDragFunc={f} block={{ numRows: 1, numCols: 2 }} /> 
);

const toolbarBlocks = (f) => (
    <div className="col-12 mt-2">
        <div className="row justify-content-center">
            {fourBlock(f)}        
            {twoBlockV(f)}        
            {twoBlockH(f)}        
            {oneBlock(f)}        
        </div>
    </div>
);

let Toolbar = (props) => (
    // only show toolbar when board is cleared or blocks are being added
    (props.show)
    ? toolbarBlocks(props.onDragFunc)
    : <></>
);

export default Toolbar;