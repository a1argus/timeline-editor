import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'
import shallowCompareWF from 'shallow-compare-without-functions'
import _ from 'lodash'
import moment from 'moment'

import { debug } from '../../modules/debug'
import { transform1DToScale, transformToTransform1D, d3Transform } from '../../modules/transforms'
import './Scale.css'


export default class Scale extends Component {
    static propTypes = {
        transform: PropTypes.object.isRequired,
        onDragScale: PropTypes.func.isRequired,
        animation: PropTypes.object.isRequired,
    }
    
    static geom = {
        textOffsetX: 10,
        lineOffsetX: 30,
        decadeWidth: 10,
        width: 200,
        height: 800
    }
    
    static cents = _.range(1, 21)

   
    
    constructor(props) {
        super(props)
        this._state = {
            transform: props.transform,
            scale: transform1DToScale(transformToTransform1D(props.transform), [0, Scale.geom.height]),
            duration: props.animation.duration,
            isDragged: false
        }

    }
    
    componentDidMount() {
        this.addDrag('.scale-g')
        this.calculateData()
        this.redraw()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this._state.isDragged) { return false }
        if(shallowCompareWF(this, nextProps, nextState)) {
            this._state.transform = nextProps.transform
            this._state.scale = transform1DToScale(transformToTransform1D(nextProps.transform), [0, Scale.geom.height])
            this._state.duration = nextProps.animation.duration
            this.redraw()
        }
        return false
    }

    calculateData() {

    }

    addDrag(selector) {
        let self = this
        let g = d3.select(selector)
        let drag = d3.drag()
        .on('start', function() {
            debug('drag start')
            d3.event.sourceEvent.stopPropagation()

            self._state.isDragged = true
        })
        .on('drag', function() {
            debug('drag drag')
            d3.event.sourceEvent.stopPropagation()

            let transform = d3Transform(g.attr('transform'))
            //transform.translateX += d3.event.dx
            transform.translateY += d3.event.dy
            g.attr('transform', `translate(${0}, ${transform.translateY})`)
            self.props.onDragScale(d3.event)
        })
        .on('end', function() {
            debug('drag end')
            d3.event.sourceEvent.stopPropagation()

            self._state.isDragged = false
            self.props.onDragScale(d3.event)
        })
        g.call(drag)
    }

    redrawCents() {
        let hCent = this._state.scale(moment("1100",'YYYY')) - this._state.scale(moment("1000", 'YYYY'));
        let scaleG = d3.select('.scale-g')
        let centG = scaleG
        .selectAll('.cent')
        .data(Scale.cents, (d, i) => i)


        // ENTER

        let centGEnter = centG
        .enter()
        .append('g')
        .attr('class', 'cent')
        .attr('transform', d => `translate(${0}, ${parseInt(this._state.scale(moment(d * 100, 'YYYY')), 10)})`)

        centGEnter
        .append('rect')
        .attr('height', hCent)
        .attr('width', Scale.geom.width);

        centGEnter
        .append('text')
        .attr('x', Scale.geom.width / 2)
        .attr('y', hCent/2)
        .attr('dy', '.35em')
        .text(d => parseInt(d + 1, 10))

        centGEnter
        .append('line')
        .attr('x1', Scale.geom.lineOffsetX)
        .attr('y1', 0)
        .attr('x2', Scale.geom.width)
        .attr('y2', 0)

        let decadeG_centGEnter = centGEnter
        .selectAll('.decade')
        .data(century => _.range(1, 10).map(decade => ({century, decade})))

        let decadeGEnter_centGEnter = decadeG_centGEnter
        .enter()
        .append('g')
        .attr('class', 'decade')
        .attr('transform', d => (
            `translate(${0}, ${
                parseInt(this._state.scale(moment(d.century * 100 + d.decade * 10, 'YYYY')), 10) -
                parseInt(this._state.scale(moment(d.century * 100, 'YYYY')), 10)
            })`
        ))

        decadeGEnter_centGEnter
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Scale.geom.decadeWidth)
        .attr('y2', 0)

        decadeGEnter_centGEnter
        .append('text')
        .attr('x', Scale.geom.decadeWidth)
        .attr('y', 0)
        .attr('dy', '.35em')
        .text(d => d.century * 100 + d.decade * 10)

        // UPDATE

        let centGUpdate = centG
        .transition()
        .duration(this._state.duration)    
        .attr('transform', d => `translate(${0}, ${parseInt(this._state.scale(moment(d * 100, 'YYYY')), 10)})`)

        centGUpdate
        .select('rect')
        .attr('height', hCent)
        .attr('width', Scale.geom.width);

        centGUpdate
        .select('text')
        .attr('x', Scale.geom.width / 2)
        .attr('y', hCent/2)
        .attr('dy', '.35em')
        .text(d => parseInt(d + 1, 10))

        centGUpdate
        .select('line')
        .attr('x1', Scale.geom.lineOffsetX)
        .attr('y1', 0)
        .attr('x2', Scale.geom.width)
        .attr('y2', 0)

        let decadeGUpdate = centGUpdate
        .selectAll('.decade')
        .attr('transform', d => `translate(${0}, ${
            parseInt(this._state.scale(moment(d.century * 100 + d.decade * 10, 'YYYY')), 10) -
            parseInt(this._state.scale(moment(d.century * 100, 'YYYY')), 10)
        })`)

        decadeGUpdate
        .select('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Scale.geom.decadeWidth)
        .attr('y2', 0)

        decadeGUpdate
        .select('text')
        .attr('x', Scale.geom.decadeWidth)
        .attr('y', 0)
        .attr('dy', '.35em')
        .text(d => d.century * 100 + d.decade * 10)


        // EXIT

        let centGExit = centG
        .exit()

        centGExit
        .remove()
    }


    redraw() {
        debug('redraw scale')
        d3.select('.scale-g')
        .attr('transform', `translate(${0}, ${0})`)
        this.redrawCents()
    }
    

    render() {
        return (
            <div
                className='scale'
                style={{width: Scale.geom.width, height: Scale.geom.height}}                
            >
                <svg
                    width={Scale.geom.width}
                    height={Scale.geom.height}
                >
                    <g className='scale-g'>
                    </g>
                </svg>
            </div>    
        )   
    }
}