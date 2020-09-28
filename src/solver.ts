enum Dir { Left, Right, Up, Down }

function oppositeDir(dir: Dir): Dir {
    // for a given direction, return its opposites
    if (dir === Dir.Left) return Dir.Right;
    else if (dir === Dir.Right) return Dir.Left;
    else if (dir === Dir.Up) return Dir.Down;
    else return Dir.Up;
}

function oppositeDirs(dirs: Array<Dir>): Array<Dir> {
    // for a list of directions, return a reversed list of the opposites 
    // of these directions
    let numDirs: number = dirs.length;
    let res: Array<Dir> = new Array<Dir>(numDirs);
    for (let i: number = 0; i < numDirs; i++) {
        res[numDirs-i-1] = oppositeDir(dirs[i]);
    }
    return res;
}

interface Block {
    readonly numRows: number;
    readonly numCols: number;
    rowPos: number;
    colPos: number;
}

function cloneBlock(block: Block): Block {
    return ({
        rowPos: block.rowPos,
        colPos: block.colPos,
        numRows: block.numRows,
        numCols: block.numCols
    });
}

interface Move {
    readonly block: Block;
    readonly dirs: Array<Dir>;
}


function moveBlock(block: Block, dirs: Array<Dir>): void {
    // for each direction in a direction list, update the block 
    // positioning accordingly
    for (let dir of dirs) {
        if (dir === Dir.Left) block.colPos--;
        else if (dir === Dir.Right) block.colPos++;
        else if (dir === Dir.Up) block.rowPos--;
        else block.rowPos++;
    }
    return;
}

function equivalentBlocks(b1: Block, b2: Block): boolean {
    // return a boolean value representing whether two blocks are equivalent
    return (
      b1.rowPos === b2.rowPos && 
      b1.colPos === b2.colPos &&
      b1.numRows === b2.numRows && 
      b1.numCols === b2.numCols
    );
}


class Board {
    // ATTRIBUTES
    private _cells: Array<Array<Block | null>> = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
    ];
    readonly blocks: Array<Block>;
    readonly winningCol: number; 
    readonly winningRow: number; 

    // METHODS
    private insertBlocks(): void {
        // for each block, ensure that all board cells to be covered by the 
        // block are free; if so, place `block` in all covered cells.
        let fourBlock: boolean = false;
        let coveredCells: number = 0;
        for (let block of this.blocks) {
            if (block.numRows*block.numCols === 4 && !fourBlock) fourBlock = true; 
            else if (block.numRows*block.numCols === 4) throw new Error("There must be exacly one block of size 4");
            for (let i: number = block.rowPos; i < block.rowPos + block.numRows; i++) {
                for (let j: number = block.colPos; j < block.colPos + block.numCols; j++) {
                    if (this._cells[i][j] === null) {
                        this._cells[i][j] = block;
                        coveredCells++;
                    } else {
                        throw new Error("Invalid block positioning");
                    }
                }
            }
        }
        if (coveredCells !== 18) throw new Error("There must be exactly two free spaces");
        if (!fourBlock) throw new Error("There must be exactly one block of size 4");
    }
    private currentDirs(block: Block): Array<Dir> {
        // for a given block return a list of directions corresponding 
        // to open moves
        let dirs: Array<Dir> = new Array<Dir>();
        let left: boolean = true;
        let right: boolean = true;
        let up: boolean = true;
        let down: boolean = true;
        // check horizontal moves
        for (let row: number = block.rowPos; row < block.rowPos + block.numRows; row++) {
            // Left
            let col: number = block.colPos;
            if (left && (col < 1 || this._cells[row][col-1] !== null)) left = false;
            // Right
            col = block.colPos + block.numCols - 1;
            if (right && (col > 2 || this._cells[row][col+1] !== null)) right = false;
        }
        // check vertical moves
        for (let col: number = block.colPos; col < block.colPos + block.numCols; col++) {
            // Up
            let row: number = block.rowPos;
            if (up && (row < 1 || this._cells[row-1][col] !== null)) up = false;
            // Down
            row = block.rowPos + block.numRows - 1;
            if (down && (row > 3 || this._cells[row+1][col] !== null)) down = false;
        }
        // Push valid directions to result list
        if (left) dirs.push(Dir.Left);
        if (right) dirs.push(Dir.Right);
        if (up) dirs.push(Dir.Up);
        if (down) dirs.push(Dir.Down);
        return dirs;
    }
    private makeMove(block: Block, dirs: Array<Dir>): void {
        // for each direction in a given list of directions and a block, 
        // move the block and update the `_cells` matrix
        let numRows: number = block.numRows;
        let numCols: number = block.numCols;
        for (let dir of dirs) {
            let initRowPos: number = block.rowPos;
            let initColPos: number = block.colPos;
            moveBlock(block, [dir]); // update block positions
            // update `_cells` for left or up moves
            if (dir === Dir.Left|| dir === Dir.Up) {
                for (let i: number = initRowPos; i < initRowPos + numRows; i++) {
                    for (let j: number = initColPos; j < initColPos + numCols; j++) {
                        if (dir === Dir.Left) this._cells[i][j-1] = block;
                        else this._cells[i-1][j] = block;
                        this._cells[i][j] = null;
                    }
                }
            // update `_cells` for right or down moves
            } else {
                for (let i: number = initRowPos + numRows - 1; i >= initRowPos; i--) {
                    for (let j: number = initColPos + numCols - 1; j >= initColPos; j--) {
                        if (dir === Dir.Right) this._cells[i][j+1] = block;
                        else this._cells[i+1][j] = block;
                        this._cells[i][j] = null;
                    }
                }

            }
        }
    }
    private findMoves(block: Block): Array<Array<Dir>> {
        // given a block, find each available direction, and then from each of these,
        // find the set of new available directions that are not steps backward, 
        // and return a list of the valid direction paths
        let res: Array<Array<Dir>> = new Array<Array<Dir>>();
        for (let initDir of this.currentDirs(block)) {
            res.push([initDir]); // push initial directions to result
            this.makeMove(block, [initDir]); // move block
            // find next directions
            for (let nextDir of this.currentDirs(block)) {
                // ensure next direction is not a move backward
                if (nextDir !== oppositeDir(initDir)) {
                    let newDirs: Array<Dir> = [initDir, nextDir];
                    res.push(newDirs); // push new list of two directions to result
                }
            }
            this.makeMove(block, oppositeDirs([initDir])); // unMove block
        }
        return res;
    }
    getMoves(): Array<Move> {
        // for each block, find all valid move paths and push
        // the corresponding Move objects to the `moves` array
        let res: Array<Move> = new Array<Move>();
        for (let block of this.blocks) {
            for (let dirs of this.findMoves(block)) {
                // clone move block
                let newBlock: Block = cloneBlock(block);
                // add move to result list
                res.push({
                    block: newBlock, 
                    dirs: dirs
                });
            }
        }
        return res;
    }
    getHash(): string {
        // walk through `_cells` matrix, convert blocks to simple strings, and
        // concatenate them into the `hash` string
        let res: string = "";
        for (let i: number = 0; i < 5; i++) {
            for (let j: number  = 0; j < 4; j++) {
                let block: Block | null = this._cells[i][j];
                if (block === null) {
                    res += "0";
                } else if ( block.numRows*block.numCols === 2) {
                    res += (block.numRows === 1 ? "2H" : "2V");
                } else {
                    res += (block.numRows*block.numCols).toString();
                } 
            }
        }
        return res;
    }
    isSolved(): boolean {
        let winningBlock: Block | null = this._cells[this.winningRow][this.winningCol];
        if (winningBlock !== null) {
            return (
                winningBlock.rowPos === this.winningRow && 
                winningBlock.colPos === this.winningCol &&
                winningBlock.numRows*winningBlock.numCols === 4
            );
        }
        return false;
    }

    // CONSTRUCTOR 
    constructor(blocks_: Array<Block>, winningRow_: number, winningCol_: number) {
        this.winningRow = winningRow_;
        this.winningCol = winningCol_;
        this.blocks = blocks_;
        this.insertBlocks();
    }
}


function cloneBoard(board: Board, move: Move): Board {
    // function to generate a new board following a move
    let blocks: Array<Block> = new Array<Block>();
    for (let block of board.blocks) {
        let newBlock: Block = cloneBlock(block);
        if (equivalentBlocks(newBlock, move.block)) {
            moveBlock(newBlock, move.dirs);
        }
        blocks.push(newBlock);
    }
    let newBoard: Board = new Board(blocks, board.winningRow, board.winningCol);
    return newBoard;
}


class TreeNode {
    // ATTRIBUTES
    readonly board: Board;
    readonly parent: TreeNode | null;
    readonly headDist: number = 0;

    // METHODS
    getChildren(hashes: Set<string>): Array<TreeNode> {
        let children: Array<TreeNode> = new Array<TreeNode>();
        for (let move of this.board.getMoves()) {
            let childBoard: Board = cloneBoard(this.board, move);
            let childHash: string = childBoard.getHash();
            if (!hashes.has(childHash)) {
                hashes.add(childHash);
                let child: TreeNode = new TreeNode(childBoard, this);
                children.push(child);
            }
        }
        return children;
    }

    // CONSTRUCTOR
    constructor(board_: Board, parent_: TreeNode | null) {
        this.board = board_;
        this.parent = parent_;
        if (this.parent !== null) this.headDist = this.parent.headDist + 1;
    }
}


class Solver {
    // ATTRIBUTES
    head: TreeNode;
    tail: TreeNode | null = null;

    // METHODS
    solve(): void {
        // TO-DO
        let hashes: Set<string> = new Set<string>();
        let queue: Array<TreeNode> = new Array<TreeNode>();
        queue.push(this.head); // add the head node to queue
        hashes.add(this.head.board.getHash()); // add the head node board hash to set
        // BFS board configurations until a winning board is found
        while (queue.length > 0) {
            let top: TreeNode | undefined = queue.shift();
            if (top !== undefined) {
                if (top.board.isSolved()) {
                    this.tail = top;
                    return;
                }
                for (let child of top.getChildren(hashes)) queue.push(child);
            }
        }
        return;
    }
    getBoards(): Array<Array<Block>> {
        if (this.tail === null) {
            return [];
        } else {
            let res: Array<Array<Block>> = new Array<Array<Block>>(this.tail.headDist);
            let node: TreeNode | null = this.tail;
            while (node !== null) {
                res[node.headDist-1] = node.board.blocks;
                node = node.parent;
            }
            return res;
        }
    }
    // CONSTRUCTOR
    constructor(blocks: Array<Block>, winningRow: number, winningCol: number) {
        this.head = new TreeNode(new Board(blocks, winningRow, winningCol), null);
    }
}

export default Solver;