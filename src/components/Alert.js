import React from 'react';
import '../styles/Alert.css';

let Alert = () => (
    <div id="overlay">
        <div className="alert alert-danger alert-dismissible fade show ml-auto mr-auto alert-body" role="alert">
            <button type="button" 
                className="close alert-button"
                data-dismiss="alert"
                aria-label="close"
                onClick={() => document.getElementById("overlay").classList.add("hide")}
            >
                <span aria-hidden="true">&times;</span>
            </button>

            <div className="h4">Welcome to the Klotski Solver!</div>
            <hr/>
            To create a Klotski puzzle, one must cover the board with <strong>exactly one</strong> red block
            and a set of other blocks such that there are <strong>exactly two</strong> uncovered spaces. The goal
            of the puzzle is to move the red block to the winning position (the pink spaces) in as few moves
            as possible.
            <hr/>
            1) Click on the board to set your winning position. 
            <br/>
            2) Drag-and-drop (desktop only) or click-to-select and click-to-place blocks
            on the board.
            <br/>
            3) Finally, click 'Solve' and watch our super cool algorithm find an optimal solution
            to your board. Step though the solution by pressing 'Next' or 'Prev', or simply
            press 'Finish' and watch as the board is solved before your eyes.
        </div>
    </div>
);

export default Alert;

