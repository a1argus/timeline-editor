import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'
import shallowCompareWF from 'shallow-compare-without-functions'

import layoutMerge from '../../modules/layoutMerge'
import { d3Transform, debug, zoomToYears } from '../../modules/utils'
import c2 from '../../modules/const'
import './Timeline.css'

const c = {
    epochW: 200,
    outerSpacingW: 50,
    titleW: 20,
    h0: 10,
    h1: 15,
    duration: 500
}

const zoomToScale = (zoom) => {
    let { year1, year2 } = zoomToYears(zoom)
    return d3.scaleTime()
    .domain([new Date(year1, 0, 1), new Date(year2, 0, 1)])
    .range([0, c2.svgH])
}

export default class Timeline extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        item: PropTypes.object.isRequired,
        zoom: PropTypes.object.isRequired,
        onDragTimeline: PropTypes.func.isRequired,
    }
    
    constructor(props) {
        super(props)
        this.state2 = {
            id: props.id,
            epochs: props.item.epochs,
            duration: props.animation.duration,
            zoom: props.zoom,
            scale: zoomToScale(props.zoom),
            x: props.item.x,
            isDragged: false
        }
    }
    
    componentDidMount() {
        this.addDrag()
        this.calculateGeom()
        this.state2.epochs = layoutMerge(this.state2.epochs, "outerY", c.h0)
        this.redraw()
    }

    componentWillUpdate() {

    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state2.isDragged) { return false }
        if(shallowCompareWF(this, nextProps, nextState)) {
            this.state2.zoom = nextProps.zoom
            this.state2.scale = zoomToScale(nextProps.zoom)
            this.duration = nextProps.animation.duration
            this.calculateGeom()
            this.state2.epochs = layoutMerge(this.state2.epochs, "outerY", c.h0)
            this.state2.x = nextProps.item.x
            this.redraw()
        }
        return false
    }
    
    addDrag() {
        let self = this
        let timelineDrag = d3.drag()
        .on('start', function() {
            debug('drag.start')
            d3.event.sourceEvent.stopPropagation()

            self.state2.isDragged = true
        })
        .on('drag', function() {
            debug('drag.drag')
            d3.event.sourceEvent.stopPropagation()
            d3.event.sourceEvent.preventDefault()
            
            let timelineG = d3.select('.timeline_' + self.state2.id)
            let t = d3Transform(timelineG.attr('transform'))
            t.translateX += d3.event.dx
            timelineG.attr('transform', `translate(${t.translateX}, ${0})`)
            self.props.onDragTimeline(d3.event, self.props.id)
        })
        .on('end', function() {
            debug('drag.end')
            d3.event.sourceEvent.stopPropagation()

            self.state2.isDragged = false
        })

        d3.select('.timeline_' + self.state2.id).call(timelineDrag)
    }

    calculateGeom() {
        this.state2.epochs.slice().forEach(d => {
            d.h = this.state2.scale(d.dateFinish) - this.state2.scale(d.dateStart)
            d.y = this.state2.scale(d.dateStart)

            if (d.h < c.h0) {
                d.regime = 'h0'
                d.outerY = d.y + (d.h / 2)
            }
            else if (d.h < c.h1) {
                d.regime = 'h1'
            }
            else {
                d.regime = 'h2'
            }
        })
    }


    redraw() {
        console.log('redraw')
        let timelineG = d3.select('.timeline_' + this.state2.id)
        .attr('transform', `translate(${this.state2.zoom.translateX + this.state2.x}, ${0})`);

        let epochG = timelineG
        .selectAll('.epoch')
        .data(this.state2.epochs, (d, i) => i)

        // ENTER

        let epochGEnter = epochG
        .enter()
        .append('g')
        .attr('class', 'epoch')
        .attr('transform', d => `translate(${c.titleW}, ${d.y})`)
        .classed('last', (d, i) => (i === this.state2.epochs.length - 1))


        // epoch rect
        epochGEnter
        .append('rect')
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('class', d => {
            switch (d.regime) {
                case 'h0':
                    return 'type0'
                case 'h1':
                    return 'type1'
                default:
                    return 'type2'
            }
        })
        .attr('height', d => ((d.h >= 0) ? d.h : 0))
        .attr('width', c.epochW)

        // epoch label connecting line
        epochGEnter
        .append('line')
        .attr('class', 'type0')
        .attr('x1', c.epochW)
        .attr('y1', d => d.h / 2)
        .attr('x2', d => {
            switch (d.regime) {
                case 'h0':
                    return c.epochW + c.outerSpacingW
                case 'h1':
                default:
                    return c.epochW / 2
            }
        })
        .attr("y2", d => {
            switch (d.regime) {
                case 'h0':
                    return d.outerY - d.y + c.h0 / 2
                case 'h1':
                default:
                    return d.h / 2
            }
        })
        .style('opacity', d => {
            switch (d.regime) {
                case 'h0':
                    return 1
                case 'h1':
                default:
                    return 0
            }
        })

        // epoch label back rect
        epochGEnter
        .append('rect')
        .attr('class', 'type0')
        .attr('x', d => {
            switch (d.regime) {
                case 'h0':
                    return c.epochW + c.outerSpacingW
                case 'h1':
                default:
                    return c.epochW / 2
            }
        })
        .attr('y', d => {
            switch (d.regime) {
                case 'h0':
                    return d.outerY - d.y
                case 'h1':
                default:
                    return 0
            }
        })
        .attr('width', 0)
        .attr('height', c.h0)
        .classed('back', true)

        // epoch label text
        epochGEnter
        .append('text')
        .text(d => d.name)
        .attr('class', d => {
            switch (d.regime) {
                case 'h0':
                    return 'type0'
                case 'h1':
                    return 'type1'
                default:
                    return 'type2'
            }
        })
        .attr('x', d => {
            switch (d.regime) {
                case 'h0':
                    return c.epochW + c.outerSpacingW
                case 'h1':
                default:
                    return c.epochW / 2
            }
        })
        .attr('y', d => {
            switch (d.regime) {
                case 'h0':
                    return d.outerY - d.y + c.h0 / 2
                case 'h1':
                default:
                    return d.h / 2
            }
        })
        .attr('dy', d => {
            switch (d.regime) {
                case 'h0': return '0.32em'
                case 'h1': return '0.32em'
                default: return '0.32em'
            }
        })

        // UPDATE

        let epochGUpdate = epochG
        .classed('last', (d, i) => (i === this.state2.epochs.length - 1))
        .transition()
        .duration(this.duration)
        .attr('transform', d => `translate(${c.titleW}, ${d.y})`)



        // epoch rect
        epochGUpdate
        .select('rect')
        .transition()
        .duration(c.duration)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('class', d => {
            switch (d.regime) {
                case 'h0':
                    return 'type0'
                case 'h1':
                    return 'type1'
                default:
                    return 'type2'
            }
        })
        .attr('height', d => ((d.h >= 0) ? d.h : 0))
        .attr('width', c.epochW)

        // epoch label connecting line
        epochGUpdate
        .select('line')
        .transition()
        .duration(c.duration)
        .attr('x1', c.epochW)
        .attr('y1', d => d.h / 2)
        .attr('x2', d => {
            switch (d.regime) {
                case 'h0':
                    return c.epochW + c.outerSpacingW
                case 'h1':
                default:
                    return c.epochW / 2
            }
        })
        .attr("y2", d => {
            switch (d.regime) {
                case 'h0':
                    return d.outerY - d.y + c.h0 / 2
                case 'h1':
                default:
                    return d.h / 2
            }
        })
        .style('opacity', d => {
            switch (d.regime) {
                case 'h0':
                    return 1
                case 'h1':
                default:
                    return 0
            }
        })

        // epoch label back rect
        epochGUpdate
        .select('rect.back')
        .transition()
        .duration(c.duration)
        .attr('class', 'type0')
        .attr('x', d => {
            switch (d.regime) {
                case 'h0':
                    return c.epochW + c.outerSpacingW
                case 'h1':
                default:
                    return c.epochW / 2
            }
        })
        .attr('y', d => {
            switch (d.regime) {
                case 'h0':
                    return d.outerY - d.y
                case 'h1':
                default:
                    return 0
            }
        })
        .attr('width', 0)
        .attr('height', c.h0)

        // epoch label text
        epochGUpdate
        .select('text')
        .transition()
        .duration(c.duration)
        .text(d => d.name)
        .attr('class', d => {
            switch (d.regime) {
                case 'h0':
                    return 'type0'
                case 'h1':
                    return 'type1'
                default:
                    return 'type2'
            }
        })
        .attr('x', d => {
            switch (d.regime) {
                case 'h0':
                    return c.epochW + c.outerSpacingW
                case 'h1':
                default:
                    return c.epochW / 2
            }
        })
        .attr('y', d => {
            switch (d.regime) {
                case 'h0':
                    return d.outerY - d.y + c.h0 / 2
                case 'h1':
                default:
                    return d.h / 2
            }
        })
        .attr('dy', d => {
            switch (d.regime) {
                case 'h0': return '0.32em'
                case 'h1': return '0.32em'
                default: return '0.32em'
            }
        })


        // EXIT

        let epochGExit = epochG
        .exit()

        epochGExit
        .remove()

    }
    

    render() {
        return (
            <g className={'timeline_' + this.props.id}>

            </g>
        )   
    }
}