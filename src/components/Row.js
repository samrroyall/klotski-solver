import React from 'react';
import Cell from './Cell';
import '../styles/Row.css';

let Row = (props) => (
    <div className="row boardrow p-0 m-0">
        {props.cells.map( (cell) =>
            <Cell
                key={cell.id}
                id={cell.id}
                block={cell.val}
                onClickFunc={props.onClickFunc}
                onDropFunc={props.onDropFunc}
                winningRow={props.winningRow}
                winningCol={props.winningCol}
            />
        )}
    </div>
);

export default Row;