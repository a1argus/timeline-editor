import React, { PropTypes, Component } from 'react'
import _ from 'lodash'

import KnobTick from './KnobTick/KnobTick'
import './ZoomKnobView.css'

export default class ZoomKnobView extends Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        size: PropTypes.object.isRequired,
        visorSizes: PropTypes.object.isRequired,
        dragScale: PropTypes.func.isRequired,
        step: PropTypes.number.isRequired,
        range: PropTypes.array.isRequired,
    }

    curve(y) {
        let rad = this.props.size.height / 2
        return {
            translate: rad * Math.sin(y / rad),
            scale: Math.abs(Math.cos(y / rad)),
            visible: (y / rad >= -Math.PI / 2) && (y / rad <= Math.PI / 2)
        }
    }    
    
    render() {
        let { value, dragScale, size, step, range, visorSizes } = this.props
        let ticksNum = Math.floor((range[1] - range[0]) / step)//
        let piTicksNum = 40
        return (
            <g
                className='zoom-knob-view'
                transform={`translate(${0}, ${size.height / 2})`}
            >
                <rect
                    x={(size.width - visorSizes.width) / 2}
                    y={-visorSizes.height / 2}
                    width={visorSizes.width}
                    height={visorSizes.height}
                />    
                {
                    _.range(-piTicksNum, ticksNum + 1 + piTicksNum).map(i => (
                        <KnobTick
                            key={i}
                            curve={this.curve.bind(this)}
                            y2={dragScale.invert(value) - dragScale.invert(range[0] + (i - 1/2) * step)}
                            y1={dragScale.invert(value) - dragScale.invert(range[0] + (i + 1/2) * step)}
                            value={(i <= ticksNum) && (i >= 0) ? range[0] + i * step + '' : ''}
                            step={step}
                            size={size}
                        />
                    ))
                }
            </g>
        )   
    }
}