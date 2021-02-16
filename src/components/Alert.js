import React from 'react';
import '../styles/Alert.css';

let Alert = () => (
    <div id="overlay">
        <div className="alert alert-danger alert-dismissible fade show alert-body" role="alert">
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

export default Alert;

