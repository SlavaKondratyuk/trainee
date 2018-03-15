import  React, {Component} from "react";
import PropTypes from "prop-types";
import "./RangeSlider.css";

const offsetAbs = (element, startOffset = 0) => {

    let offset = startOffset;
    offset += element.offsetLeft;
    if(element.offsetParent !== null){
        return offsetAbs(element.offsetParent, offset);
    }
    return offset;
}

export default class RangeSlider extends Component{
    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
    }
    static defaultProps = {
        min: 0
    }

    state = {
        rangeWidth: 0,
        canMove: false
    }

    countValue = (clientX) => {
        let start = this.props.min,
            end = this.props.max,
            deltaX = clientX - offsetAbs(this.rangeBar),
            shiftWidth = deltaX / this.rangeBar.clientWidth;
        if(deltaX <= 0 || deltaX > this.rangeBar.clientWidth) {
            return false;
        }
        this.setState({
            rangeWidth: shiftWidth
        })
    }

    clickHandler = (e) => {
        if(e.target !== this.rangePointer){
            this.countValue(e.clientX);
        }
    }

    moveHandler = (e) => {
        if(this.state.canMove){
            this.countValue(e.clientX);
        } else {
            return false;
        }
    }

    allowMove = () => {
        this.setState({
            canMove: true
        })
    }

    deniedMove = () => {
        this.setState({
            canMove: false
        })
    }

    render(){
        return (
            <div className="range__wrapper">
                <span className="range__min">{this.props.min}</span>
                    <div className="range__bar" ref={(node) => {
                        this.rangeBar = node;
                    }} onClick={this.clickHandler}
                         onMouseMove={this.moveHandler}
                         onMouseLeave={this.deniedMove}
                    >
                        <div className="range__value" style={{
                            width: this.state.rangeWidth * 100 + "%"
                        }}></div>
                        <div className="range__pointer" ref={(node) => {
                             this.rangePointer = node;
                        }} style={{
                            left: this.state.rangeWidth * 100 + "%"
                        }}
                        onMouseDown={this.allowMove}
                             onMouseUp={this.deniedMove}
                        ></div>
                    </div>
                <span className="range__max">{this.props.max}</span>
            </div>
        )
    }
}