import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'

import { debug } from '../../../modules/debug'
import { d3Transform } from '../../../modules/transforms'
import './ZoomKnobDrag.css'



export default class ZoomKnobDrag extends Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        onDragZoom: PropTypes.func.isRequired,
        dragScale: PropTypes.func.isRequired,
        size: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.addDrag('.zoom-knob-drag')
    }

    shouldComponentUpdate() {
        return false
    }

    addDrag(selector) {
        let { size, dragScale, onDragZoom } = this.props
        let g = d3.select(selector)
        let drag = d3.drag()
        .on('start', function() {
            debug('drag start')
            d3.event.sourceEvent.stopPropagation()
        })
        .on('drag', function() {
            debug('drag drag')
            d3.event.sourceEvent.stopPropagation()

            let transform = d3Transform(g.attr('transform'))
            //transform.translateX += d3.event.dx
            transform.translateY += d3.event.dy
            if(transform.translateY <= (size.height / 2) && transform.translateY >= -(size.height / 2)) {
                g.attr('transform', `translate(${0}, ${transform.translateY})`)
                onDragZoom(dragScale(transform.translateY), true)
            }
        })
        .on('end', function() {
            debug('drag end')
            d3.event.sourceEvent.stopPropagation()

            let transform = d3Transform(g.attr('transform'))
            onDragZoom(dragScale(transform.translateY), false)
        })
        g.call(drag)
    }

    render() {
        let { dragScale, value, size } = this.props
        return (
            <g
                className='zoom-knob-drag'
                transform={`translate(${0}, ${dragScale.invert(value)})`}
            >
                <rect
                    x={0}
                    y={-size.height}
                    width={size.width}
                    height={3 * size.height}
                />
            </g>
        )   
    }
}