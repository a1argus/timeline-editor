import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'

import c from '../../modules/const'
import { d3Transform, debug } from '../../modules/utils'
import Timeline from '../Timeline/Timeline'
import './Screen.css'



export default class Screen extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        onDragScreen: PropTypes.func.isRequired,
        animation: PropTypes.object.isRequired,
        onDragTimeline: PropTypes.func.isRequired,
    }

    constructor() {
        super()
        this.isDragged = false
    }
    
    componentDidMount() {
        this.addDrag()
    }

    componentDidUpdate() {

    }

    shouldComponentUpdate() {
        if(this.isDragged) { return false }
        return true
    }

    addDrag() {
        let self = this
        let screenDrag = d3.drag()
        .on('start', function() {
            d3.event.sourceEvent.stopPropagation()

            self.isDragged = true
            debug(0, self.isDragged)
        })
        .on('drag', function() {
            d3.event.sourceEvent.stopPropagation()
            d3.event.sourceEvent.preventDefault()
            if(d3.event.dx !== 0 || d3.event.dy !== 0) {
                let screenG = d3.select(self.screenG)
                let t = d3Transform(screenG.attr('transform'))
                t.translateX += d3.event.dx
                t.translateY += d3.event.dy
                screenG.attr('transform', `translate(${t.translateX}, ${t.translateY})`)

                self.props.onDragScreen(d3.event)
            }
        })
        .on('end', function() {
            d3.event.sourceEvent.stopPropagation()

            self.isDragged = false
            debug(0, self.isDragged)

            let screenG = d3.selectAll('.screen-g')
            screenG.attr('transform', 'translate(0, 0)')

            self.props.onDragScreen(d3.event)

        })

        d3.select('.screen-g').call(screenDrag)
    }

    render() {
        const { items, zoom, animation, onDragTimeline } = this.props
        return (
            <svg
                width={c.svgW}
                height={c.svgH}
                className='screen'
            >
                <g
                    ref={(screenG) => { this.screenG = screenG }}
                    className='screen-g'
                    transform="translate(0, 0)"
                >
                    <rect
                        x={-10000/2}
                        y={-10000/2}
                        width={10000}
                        height={10000} 
                        className='screen-back'
                    />
                    {
                        items.map((item, i) => (
                            <Timeline
                                key={i}
                                id={0}
                                item={item}
                                zoom={zoom}
                                animation={animation}
                                onDragTimeline={onDragTimeline}
                            />
                        ))
                    }
                </g>    
            </svg>
        )   
    }
}