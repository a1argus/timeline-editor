import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'


import ZoomKnobDrag from './ZoomKnobDrag/ZoomKnobDrag'
import ZoomKnobView from './ZoomKnobView/ZoomKnobView'
import './ZoomKnob.css'



export default class ZoomKnob extends Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        size: PropTypes.object.isRequired,
        visorSizes: PropTypes.object.isRequired,
        onChangeZoom: PropTypes.func.isRequired,
        range: PropTypes.array.isRequired,
        step: PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {value: props.value}
    }
    
    componentWillMount() {
        let { size, range } = this.props
        this.dragScale = d3.scaleLinear()
        .domain([-(size.height / 2), (size.height / 2)])
        .range(range)
//      .clamp(true)
    }

    onDragZoom(value, isDragged) {
        let { onChangeZoom } = this.props
        this.setState({value})
        if(!isDragged) { onChangeZoom(value) }
    }
    
    render() {
        const { size, range, step, visorSizes } = this.props
        return (
            <div
                className='zoom-knob'
                style={{width: size.width, height: size.height}}
            >
                <svg
                    width={size.width}
                    height={size.height}
                >
                    <ZoomKnobDrag
                        value={this.state.value}
                        onDragZoom={this.onDragZoom.bind(this)}
                        dragScale={this.dragScale}
                        size={size}
                    />
                    <ZoomKnobView
                        value={this.state.value}
                        dragScale={this.dragScale}
                        range={range}
                        step={step}
                        size={size}
                        visorSizes={visorSizes}
                    />                
                </svg>    
            </div>    
        )   
    }
}