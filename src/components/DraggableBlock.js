import React from 'react';
import '../styles/DraggableBlock.css';

class DraggableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rel: null,
      pos: { left: 0, top: 0}
    };
    this.click = this.click.bind(this);
    this.move = this.move.bind(this);
    this.drop = this.drop.bind(this);
  }

  // function called on mouse down on a draggable block
  click(e) {
    if (e.button !== 0) return
    const currPos = e.currentTarget.getBoundingClientRect();
    this.setState(() => ({
      rel: {
        left: currPos.left,
        top: currPos.top
      }
    }));
    document.addEventListener("mousemove", this.move); // listen for mouse move
    document.addEventListener("mouseup", this.drop); // listen for mouse up (drop)
    this.props.onDragFunc(e.currentTarget.id); // send content the current block's ID
    e.stopPropagation();
    e.preventDefault();
  }
  
  // function called on mouse move after mouse down on a draggable block
  move(e) {
    const x = e.pageX;
    const y = e.pageY;
    this.setState((state) => ({
      pos: {
        left: x - state.rel.left,
        top: y - state.rel.top
      }
    }));
    e.stopPropagation();
    e.preventDefault();
  }

  // function called on mouse up after mouse down on a draggable block
  drop(e) {
    this.setState(() => ({
      rel: null,
      pos: {left: 0, top: 0}
    }));
    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("mouseup", this.drop);
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    // dragblock vars
    const steez = {
      position: "relative",
      left: this.state.pos.left + "px",
      top: this.state.pos.top + "px"
    };
    const oneblockString  = "draggable-oneblock  draggable m-2 p-0 bg-success border border-dark rounded";
    const twoblockHString = "draggable-twoblockH draggable m-2 p-0 bg-warning border border-dark rounded";
    const twoblockVString = "draggable-twoblockV draggable m-2 p-0 bg-primary border border-dark rounded";
    const fourblockString = "draggable-fourblock draggable m-2 p-0 bg-danger  border border-dark rounded";
    let classString = "";
    // check block size
    if (this.props.size === 4) classString = fourblockString;
    else if (this.props.size === 2 && this.props.block.numCols === 1) classString = twoblockVString;
    else if (this.props.size === 2) classString = twoblockHString;
    else if (this.props.size === 1) classString = oneblockString;
    else alert("Invalid draggable block properties");
    // return dragblock
    return (
      <div className={classString}
        id={this.props.id}
        style={steez}
        onMouseDown={this.click}>
      </div>
    );
  }
}

export default DraggableBlock;