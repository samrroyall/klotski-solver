import React from 'react';

// button for clearing board
const clearButton = (f) => (
    <button className="btn btn-sm btn-danger mr-2" onClick={f}>Clear</button>
);
// button for displaying the default board
const defaultButton = (f) =>  (
    <button className="btn btn-sm btn-warning mx-1" onClick={f}>Default</button>
);
// button to finalize moves in solution
const finishButton = (f) =>  (
    <button className="btn btn-sm btn-success ml-2" onClick={f}>Finish</button>
);
//button to see next move in solution
const nextButton = (f) =>  (
    <button className="btn btn-sm btn-warning mx-2" onClick={f}>Next</button>
);
// button to see previous move in solution
const prevButton = (f) =>  (
    <button className="btn btn-sm btn-danger mr-2" onClick={f} id="prev-btn">Prev</button>
);
// button for running script to solve board
const solveButton = (f) =>  (
    <button className="btn btn-sm btn-primary ml-2" onClick={f}>Solve!</button>
);

function Buttons(props) {
    // buttons displayed after solve button is pressed
    if (props.state === "solved") {
        return (
            <div className="text-center mt-2">
                {prevButton(props.onPrev)}
                {nextButton(props.onNext)}
                {finishButton(props.onFinish)}
            </div>
        );
    // buttons displayed when board is cleared of blocks
    } else if (props.state === "cleared"){
        return (
            <div className="text-center mt-2">
                {defaultButton(props.onDefault)}
                {solveButton(props.onSolve)}
            </div>
        );
    // buttons displayed when default board is shown
    // or after blocks have been dropped
    } else if (props.state === "default" || props.state === "blocksAdded") {
        return (
            <div className="text-center mt-2">
                {clearButton(props.onClear)}
                {solveButton(props.onSolve)}
            </div>
        );
    // buttons displayed after last solution move is seen
    // or under any other circumstances
    } else {
        return <></>;
    }
}

export default Buttons;

