(this["webpackJsonpklotski-solver"]=this["webpackJsonpklotski-solver"]||[]).push([[0],{12:function(e,t,o){e.exports=o(18)},17:function(e,t,o){},18:function(e,t,o){"use strict";o.r(t);var n,s=o(0),r=o.n(s),a=o(10),l=o.n(a),i=o(3),c=o(4),u=o(1),d=o(7),h=o(6),p=o(11),b=o(2);function m(e){return e===n.Left?n.Right:e===n.Right?n.Left:e===n.Up?n.Down:n.Up}function v(e){for(var t=e.length,o=new Array(t),n=0;n<t;n++)o[t-n-1]=m(e[n]);return o}function f(e){return{rowPos:e.rowPos,colPos:e.colPos,numRows:e.numRows,numCols:e.numCols}}function w(e,t){var o,s=Object(b.a)(t);try{for(s.s();!(o=s.n()).done;){var r=o.value;r===n.Left?e.colPos--:r===n.Right?e.colPos++:r===n.Up?e.rowPos--:e.rowPos++}}catch(a){s.e(a)}finally{s.f()}}!function(e){e[e.Left=0]="Left",e[e.Right=1]="Right",e[e.Up=2]="Up",e[e.Down=3]="Down"}(n||(n={}));var k=function(){function e(t,o,n){Object(i.a)(this,e),this._cells=[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],this.winningCol=void 0,this.winningRow=void 0,this.blocks=void 0,this.moves=void 0,this.hash=void 0,this.solved=void 0,this.winningRow=o,this.winningCol=n,this.blocks=t,this.insertBlocks(),this.hash=this.setHash(),this.solved=this.isSolved(),this.moves=this.setMoves()}return Object(c.a)(e,[{key:"insertBlocks",value:function(){var e,t=!1,o=Object(b.a)(this.blocks);try{for(o.s();!(e=o.n()).done;){var n=e.value;if(n.numRows*n.numCols!==4||t){if(n.numRows*n.numCols===4)throw new Error("There must be exacly one block of size 4")}else t=!0;for(var s=n.rowPos;s<n.rowPos+n.numRows;s++)for(var r=n.colPos;r<n.colPos+n.numCols;r++){if(null!==this._cells[s][r])throw new Error("Invalid block positioning");this._cells[s][r]=n}}}catch(a){o.e(a)}finally{o.f()}if(!t)throw new Error("There must be exactly one block of size 4")}},{key:"setHash",value:function(){for(var e="",t=0,o=0;o<5;o++)for(var n=0;n<4;n++){var s=this._cells[o][n];null===s?(e+="0",t++):s.numRows*s.numCols===2?e+=1===s.numRows?"2H":"2V":e+=(s.numRows*s.numCols).toString()}if(2!==t)throw new Error("There must be exactly 2 free spaces on the board");return e}},{key:"currentDirs",value:function(e){for(var t=new Array,o=!0,s=!0,r=!0,a=!0,l=e.rowPos;l<e.rowPos+e.numRows;l++){var i=e.colPos;o&&(i<1||null!==this._cells[l][i-1])&&(o=!1),i=e.colPos+e.numCols-1,s&&(i>2||null!==this._cells[l][i+1])&&(s=!1)}for(var c=e.colPos;c<e.colPos+e.numCols;c++){var u=e.rowPos;r&&(u<1||null!==this._cells[u-1][c])&&(r=!1),u=e.rowPos+e.numRows-1,a&&(u>3||null!==this._cells[u+1][c])&&(a=!1)}return o&&t.push(n.Left),s&&t.push(n.Right),r&&t.push(n.Up),a&&t.push(n.Down),t}},{key:"makeMove",value:function(e,t){var o,s=e.numRows,r=e.numCols,a=Object(b.a)(t);try{for(a.s();!(o=a.n()).done;){var l=o.value,i=e.rowPos,c=e.colPos;if(w(e,[l]),l===n.Left||l===n.Up)for(var u=i;u<i+s;u++)for(var d=c;d<c+r;d++)l===n.Left?this._cells[u][d-1]=e:this._cells[u-1][d]=e,this._cells[u][d]=null;else for(var h=i+s-1;h>=i;h--)for(var p=c+r-1;p>=c;p--)l===n.Right?this._cells[h][p+1]=e:this._cells[h+1][p]=e,this._cells[h][p]=null}}catch(m){a.e(m)}finally{a.f()}}},{key:"findMoves",value:function(e){var t,o=new Array,n=new Array,s=Object(b.a)(this.currentDirs(e));try{for(s.s();!(t=s.n()).done;){var r=t.value;n.push([r])}}catch(d){s.e(d)}finally{s.f()}for(;n.length>0;){var a=n.pop();if(void 0!==a){if(o.push(a),this.makeMove(e,a),a.length<2){var l,i=Object(b.a)(this.currentDirs(e));try{for(i.s();!(l=i.n()).done;){var c=l.value;if(c!==m(a[a.length-1])){var u=Object(p.a)(a);u.push(c),n.push(u)}}}catch(d){i.e(d)}finally{i.f()}}this.makeMove(e,v(a))}}return o}},{key:"setMoves",value:function(){var e,t=new Array,o=Object(b.a)(this.blocks);try{for(o.s();!(e=o.n()).done;){var n,s=e.value,r=Object(b.a)(this.findMoves(s));try{for(r.s();!(n=r.n()).done;){var a=n.value,l=f(s);t.push({block:l,dirs:a})}}catch(i){r.e(i)}finally{r.f()}}}catch(i){o.e(i)}finally{o.f()}return t}},{key:"isSolved",value:function(){var e=this._cells[this.winningRow][this.winningCol];return null!==e&&(e.rowPos===this.winningRow&&e.colPos===this.winningCol&&e.numRows*e.numCols===4)}}]),e}();function g(e,t){var o,n,s,r=new Array,a=Object(b.a)(e.blocks);try{for(a.s();!(o=a.n()).done;){var l=f(o.value);n=l,s=t.block,n.rowPos===s.rowPos&&n.colPos===s.colPos&&n.numRows===s.numRows&&n.numCols===s.numCols&&w(l,t.dirs),r.push(l)}}catch(i){a.e(i)}finally{a.f()}return new k(r,e.winningRow,e.winningCol)}var y=function(){function e(t,o){Object(i.a)(this,e),this.board=void 0,this.parent=void 0,this.headDist=0,this.board=t,this.parent=o,null!==this.parent&&(this.headDist=this.parent.headDist+1)}return Object(c.a)(e,[{key:"getChildren",value:function(t){var o,n=new Array,s=Object(b.a)(this.board.moves);try{for(s.s();!(o=s.n()).done;){var r=o.value,a=g(this.board,r);if(!t.has(a.hash)){var l=new e(a,this);n.push(l)}}}catch(i){s.e(i)}finally{s.f()}return n}}]),e}(),C=function(){function e(t,o,n){Object(i.a)(this,e),this.head=void 0,this.tail=null,this.head=new y(new k(t,o,n),null)}return Object(c.a)(e,[{key:"solve",value:function(){var e=new Set,t=new Array;for(t.push(this.head),e.add(this.head.board.hash);t.length>0;){var o=t.shift();if(void 0!==o){if(o.board.solved)return this.tail=o,void console.log("Solution found of length: "+o.headDist);var n,s=Object(b.a)(o.getChildren(e));try{for(s.s();!(n=s.n()).done;){var r=n.value;e.add(r.board.hash),t.push(r)}}catch(a){s.e(a)}finally{s.f()}}}}},{key:"getBoards",value:function(){if(null===this.tail)return[];for(var e=new Array(this.tail.headDist),t=this.tail;null!==t;)e[t.headDist-1]=t.board.blocks,t=t.parent;return e}}]),e}();o(17);function P(e){if(4===e.size)return r.a.createElement("div",{className:"col-6 fourblock m-0 bg-danger border border-dark rounded"});if(2===e.size){if(1===e.block.numCols)return r.a.createElement("div",{className:"col-3 twoblockV m-0 bg-primary border border-dark rounded"});if(2===e.block.numCols)return r.a.createElement("div",{className:"col-6 twoblockH m-0 bg-warning border border-dark rounded"})}else if(1===e.size)return r.a.createElement("div",{className:"col-3 oneblock m-0 bg-success border border-dark rounded"})}var R=function(e){Object(d.a)(o,e);var t=Object(h.a)(o);function o(e){var n;return Object(i.a)(this,o),(n=t.call(this,e)).state={currRow:parseInt(e.id.split(",")[0]),currCol:parseInt(e.id.split(",")[1])},n.click=n.click.bind(Object(u.a)(n)),n}return Object(c.a)(o,[{key:"click",value:function(e){this.props.onClickFunc(e.currentTarget.id)}},{key:"render",value:function(){if(null==this.props.block)return r.a.createElement("span",null);if(this.props.block.hasOwnProperty("colPos")||this.props.block.hasOwnProperty("rowPos")){var e=this.props.block.hasOwnProperty("numCols")?this.props.block.numRows*this.props.block.numCols:this.props.block.numRows*this.props.block.numRows;return 0===e?this.state.currRow!==this.props.winningRow&&this.state.currRow!==this.props.winningRow+1||this.state.currCol!==this.props.winningCol&&this.state.currCol!==this.props.winningCol+1?4===this.state.currRow||3===this.state.currCol?r.a.createElement("div",{className:"col-3 boardcell p-0 m-0 border",id:this.props.id,onMouseUp:this.props.onDropFunc}):r.a.createElement("div",{className:"col-3 boardcell p-0 m-0 border",id:this.props.id,onMouseUp:this.props.onDropFunc,onMouseDown:this.click}):4===this.state.currRow||3===this.state.currCol?r.a.createElement("div",{className:"col-3 boardcell winningcell p-0 m-0 border",id:this.props.id,onMouseUp:this.props.onDropFunc}):r.a.createElement("div",{className:"col-3 boardcell winningcell p-0 m-0 border",id:this.props.id,onMouseUp:this.props.onDropFunc,onMouseDown:this.click}):r.a.createElement(P,{key:this.props.id,size:e,block:this.props.block})}return r.a.createElement("div",{className:"col-3 p-0 m-0"})}}]),o}(r.a.Component);function E(e){var t=e.cells.map((function(t){return r.a.createElement(R,{key:t.id,id:t.id,block:t.val,onDropFunc:e.onDropFunc,onClickFunc:e.onClickFunc,winningRow:e.winningRow,winningCol:e.winningCol})}));return r.a.createElement("div",{className:"row boardrow p-0 m-0"},t)}var x=function(e){Object(d.a)(o,e);var t=Object(h.a)(o);function o(e){var n;return Object(i.a)(this,o),(n=t.call(this,e)).state={blocks:n.props.blocks,blocksAdded:!1},n.onDrop=n.onDrop.bind(Object(u.a)(n)),n}return Object(c.a)(o,[{key:"onDrop",value:function(e){if(this.props.dragBlock){var t={rowPos:parseInt(e.currentTarget.id.split(",")[0]),colPos:parseInt(e.currentTarget.id.split(",")[1]),numRows:this.props.dragBlock.numRows,numCols:this.props.dragBlock.numCols},o=t.rowPos+t.numRows-1,n=t.colPos+t.numCols-1;if(t.numRows*t.numCols===4&&t.rowPos===this.props.winningRow&&t.colPos===this.props.winningCol)alert("The block of size 4 cannot be placed in the winning position");else if(o>4||n>3)alert("Invalid block placement");else{var s=this.state.blocks;s.push(t),this.setState((function(e){return{blocksAdded:!0,blocks:s}})),this.props.onAddBlock(this.state.blocks)}}}},{key:"getBlocks",value:function(e){e!==this.state.blocks&&this.setState((function(t){return{blocks:e}}));for(var t={numRows:0,numCols:0},o=new Array(5),n=0;n<5;n++){for(var s={id:n,row:new Array(4)},r=0;r<4;r++){var a={id:n.toString()+","+r.toString(),val:{numRows:0,numCols:0,rowPos:n,colPos:r}};s.row[r]=a}o[n]=s}for(var l=0;l<e.length;l++)for(var i=e[l],c=i.rowPos+i.numRows-1,u=i.colPos+i.numCols-1,d=i.rowPos;d<=c;d++)for(var h=i.colPos;h<=u;h++)d===i.rowPos&&h===i.colPos?o[d].row[h].val=i:d===i.rowPos?o[d].row[h].val=null:o[d].row[h].val=t;return o}},{key:"render",value:function(){var e=this,t=this.getBlocks(this.props.blocks).map((function(t){return r.a.createElement(E,{key:t.id,cells:t.row,onDropFunc:e.onDrop,onClickFunc:e.props.onClickFunc,winningRow:e.props.winningRow,winningCol:e.props.winningCol})}));return r.a.createElement("div",{className:"p-0 mt-4 border",id:"board"},t)}}]),o}(r.a.Component),D=function(e){Object(d.a)(o,e);var t=Object(h.a)(o);function o(e){var n;return Object(i.a)(this,o),(n=t.call(this,e)).state={rel:null,pos:{left:0,top:0}},n.drag=n.drag.bind(Object(u.a)(n)),n.move=n.move.bind(Object(u.a)(n)),n.drop=n.drop.bind(Object(u.a)(n)),n}return Object(c.a)(o,[{key:"drag",value:function(e){if(0===e.button){var t=e.currentTarget.getBoundingClientRect();this.setState((function(e){return{rel:{left:t.left,top:t.top}}})),document.addEventListener("mousemove",this.move),document.addEventListener("mouseup",this.drop),this.props.onDragFunc(e.currentTarget.id),e.stopPropagation(),e.preventDefault()}}},{key:"move",value:function(e){var t=this,o=e.pageX,n=e.pageY;this.setState((function(e){return{pos:{left:o-t.state.rel.left,top:n-t.state.rel.top}}})),e.stopPropagation(),e.preventDefault()}},{key:"drop",value:function(e){this.setState((function(e){return{rel:null,pos:{left:0,top:0}}})),document.removeEventListener("mousemove",this.move),document.removeEventListener("mouseup",this.drop),e.stopPropagation(),e.preventDefault()}},{key:"render",value:function(){if(4===this.props.size)return r.a.createElement("div",{className:"draggable-fourblock m-0 bg-danger border border-dark rounded draggable",id:this.props.id,style:{position:"relative",left:this.state.pos.left+"px",top:this.state.pos.top+"px"},onMouseDown:this.drag});if(2===this.props.size){if(1===this.props.block.numCols)return r.a.createElement("div",{className:"draggable-twoblockV m-0 bg-primary border border-dark rounded draggable",id:this.props.id,style:{position:"relative",left:this.state.pos.left+"px",top:this.state.pos.top+"px"},onMouseDown:this.drag});if(2===this.props.block.numCols)return r.a.createElement("div",{className:"draggable-twoblockH m-0 bg-warning border border-dark rounded draggable",id:this.props.id,style:{position:"relative",left:this.state.pos.left+"px",top:this.state.pos.top+"px"},onMouseDown:this.drag})}else if(1===this.props.size)return r.a.createElement("div",{className:"draggable-oneblock m-0 bg-success border border-dark rounded draggable",id:this.props.id,style:{position:"relative",left:this.state.pos.left+"px",top:this.state.pos.top+"px"},onMouseDown:this.drag})}}]),o}(r.a.Component);function j(e){return e.show?r.a.createElement("div",{className:"col-10 col-xl-4 mt-5"},r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement(D,{size:4,id:"2,2",onDragFunc:e.onDragFunc}),r.a.createElement("div",{className:"mx-2"}),r.a.createElement(D,{size:2,id:"2,1",block:{numRows:2,numCols:1},onDragFunc:e.onDragFunc})),r.a.createElement("div",{className:"row justify-content-center mt-3"},r.a.createElement(D,{size:1,id:"1,1",onDragFunc:e.onDragFunc}),r.a.createElement("div",{className:"mx-2"}),r.a.createElement(D,{size:2,id:"1,2",block:{numRows:1,numCols:2},onDragFunc:e.onDragFunc}))):r.a.createElement("span",null)}function O(e){var t=r.a.createElement("button",{className:"btn btn-danger mr-2",onClick:e.onClear},"Clear"),o=r.a.createElement("button",{className:"btn btn-danger mr-2",onClick:e.onDoubleClear},"Clear"),n=r.a.createElement("button",{className:"btn btn-warning mx-1",onClick:e.onDefault},"Default"),s=r.a.createElement("button",{className:"btn btn-primary ml-2",onClick:e.onSolve},"Solve!"),a=r.a.createElement("button",{className:"btn btn-danger mr-2",onClick:e.onPrev,id:"prev-btn"},"Prev"),l=r.a.createElement("button",{className:"btn btn-warning mx-2",onClick:e.onNext},"Next"),i=r.a.createElement("button",{className:"btn btn-success ml-2",onClick:e.onFinish},"Finish");return e.solved?r.a.createElement("div",{className:"text-center mt-3"},a,l,i):e.blocksAdded?r.a.createElement("div",{className:"text-center mt-3"},o,s):e.cleared?r.a.createElement("div",{className:"text-center mt-3"},n,s):e.finished?r.a.createElement("span",null):r.a.createElement("div",{className:"text-center mt-3"},t,s)}var N=function(e){Object(d.a)(o,e);var t=Object(h.a)(o);function o(e){var n;return Object(i.a)(this,o),(n=t.call(this,e)).state={blocks:[],blocksAdded:!1,cleared:!0,displayText:"Klotski Solver",default:!1,solved:!1,finished:!1,dragBlock:null,winningRow:3,winningCol:1},n.blocksAdded=n.blocksAdded.bind(Object(u.a)(n)),n.clear=n.clear.bind(Object(u.a)(n)),n.doubleClear=n.doubleClear.bind(Object(u.a)(n)),n.default=n.default.bind(Object(u.a)(n)),n.solve=n.solve.bind(Object(u.a)(n)),n.next=n.next.bind(Object(u.a)(n)),n.prev=n.prev.bind(Object(u.a)(n)),n.restart=n.restart.bind(Object(u.a)(n)),n.finish=n.finish.bind(Object(u.a)(n)),n.dragBlockInfo=n.dragBlockInfo.bind(Object(u.a)(n)),n.clearDragBlock=n.clearDragBlock.bind(Object(u.a)(n)),n.setWinningPos=n.setWinningPos.bind(Object(u.a)(n)),n}return Object(c.a)(o,[{key:"blocksAdded",value:function(e){this.setState((function(t){return{blocks:e,blocksAdded:!0,cleared:!1,default:!1}}))}},{key:"clear",value:function(){this.setState((function(e){return{blocks:[],blocksAdded:!1,cleared:!0,default:!1,displayText:"Klotski Solver",solved:!1,finished:!1,dragBlock:null,winningRow:3,winningCol:1}}))}},{key:"doubleClear",value:function(){this.clear()}},{key:"restart",value:function(){var e=this.clear;setTimeout((function(){e()}),3e3)}},{key:"solve",value:function(){try{var e=new C(this.state.blocks,this.state.winningRow,this.state.winningCol);e.solve();var t=e.getBoards(),o=t.length;0===o?(this.setState((function(e){return{displayText:"No Solution Found :("}})),this.restart()):this.setState((function(e){return{blocksAdded:!1,cleared:!1,default:!1,displayText:"Solution of Length "+o.toString()+" Found!",boards:t,boardIdx:-1,solved:!0}}))}catch(n){alert(n)}}},{key:"next",value:function(){var e=this;0!==this.state.boards.length&&(this.state.boardIdx===this.state.boards.length-1?(this.setState((function(e){return{displayText:"You Win!"}})),this.restart()):this.setState((function(t){return{blocks:e.state.boards[e.state.boardIdx+1],boardIdx:e.state.boardIdx+1,displayText:"Move "+(e.state.boardIdx+2).toString()}})))}},{key:"prev",value:function(){var e=this;0!==this.state.boards.length&&-1!==this.state.boardIdx&&this.setState((function(t){return{blocks:e.state.boards[e.state.boardIdx-1],boardIdx:e.state.boardIdx-1,displayText:e.state.boardIdx<=0?"Klotski Solver":"Move "+e.state.boardIdx.toString()}}))}},{key:"finish",value:function(){this.setState((function(e){return{solved:!1,finished:!0}}));var e=this.state.boardIdx,t=this.state.boards.length,o=this.next,n=setInterval((function(){e<t?(o(),e++):clearInterval(n)}),250)}},{key:"default",value:function(){var e=[{rowPos:0,colPos:0,numRows:2,numCols:1},{rowPos:0,colPos:1,numRows:2,numCols:2},{rowPos:0,colPos:3,numRows:2,numCols:1},{rowPos:2,colPos:0,numRows:2,numCols:1},{rowPos:2,colPos:1,numRows:1,numCols:2},{rowPos:2,colPos:3,numRows:2,numCols:1},{rowPos:3,colPos:1,numRows:1,numCols:1},{rowPos:3,colPos:2,numRows:1,numCols:1},{rowPos:4,colPos:0,numRows:1,numCols:1},{rowPos:4,colPos:3,numRows:1,numCols:1}];this.setState((function(t){return{blocks:e,blocksAdded:!1,cleared:!1,default:!0,winningRow:3,winningCol:1}}))}},{key:"dragBlockInfo",value:function(e){this.setState((function(t){return{dragBlock:{numRows:parseInt(e.split(",")[0]),numCols:parseInt(e.split(",")[1])}}}))}},{key:"setWinningPos",value:function(e){this.state.cleared&&this.setState((function(t){return{winningRow:parseInt(e.split(",")[0]),winningCol:parseInt(e.split(",")[1])}}))}},{key:"clearDragBlock",value:function(e){this.setState((function(e){return{dragBlock:null}}))}},{key:"render",value:function(){return r.a.createElement("div",{id:"content-wrapper"},r.a.createElement("div",{className:"h1 text-center mt-1 mb-0",id:"header"},this.state.displayText),r.a.createElement("div",{className:"row justify-content-center px-0 mx-0",onMouseDown:this.clearDragBlock},r.a.createElement("div",{className:"col-4 board"},r.a.createElement(x,{blocks:this.state.blocks,dragBlock:this.state.dragBlock,onAddBlock:this.blocksAdded,onClickFunc:this.setWinningPos,winningRow:this.state.winningRow,winningCol:this.state.winningCol}),r.a.createElement(O,{blocksAdded:this.state.blocksAdded,cleared:this.state.cleared,finished:this.state.finished,solved:this.state.solved,onClear:this.clear,onDoubleClear:this.doubleClear,onDefault:this.default,onFinish:this.finish,onNext:this.next,onPrev:this.prev,onSolve:this.solve})),r.a.createElement(j,{show:this.state.cleared||this.state.blocksAdded,onDragFunc:this.dragBlockInfo})),r.a.createElement("div",{className:"text-center text-secondary",id:"footer"},"Developed by Sam Royall"))}}]),o}(r.a.Component);var S=function(){return r.a.createElement(N,null)};l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(S,null)),document.getElementById("root"))}},[[12,1,2]]]);
//# sourceMappingURL=main.a1fa5440.chunk.js.map