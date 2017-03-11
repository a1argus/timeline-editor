import React, { PropTypes, Component } from 'react'

import './KnobTick.css'

export default class ZoomKnobView extends Component {
	static propTypes = {
		y1: PropTypes.number.isRequired,
		y2: PropTypes.number.isRequired,
		curve: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired,
	}


	render() {
		let { y1, y2, value, curve, size } = this.props
		let y = (y2 + y1) / 2
		let height = curve(y2).translate - curve(y1).translate
		return curve(y).visible
			?
			<g
				className='zoom-knob__tick'
			>
				<rect
					x={0}
					y={curve(y1).translate}
					width={size.width}
					height={Math.max(height, 0)}
				    style={{opacity: (1 - curve(y).scale) / 2}}
				/>
				<g
					transform={`translate(${0}, ${curve(y).translate})`}
				>
					<line
						x1={0}
						y1={0}
					    x2={10}
					    y2={0}
					/>

					<g
						transform={`scale(1, ${curve(y).scale})`}
					>

						<text
							x={size.width / 2}
						    dy={'0.32em'}
						>
							{value}
						</text>
					</g>
				</g>
			</g>
			:
				null
	}
}