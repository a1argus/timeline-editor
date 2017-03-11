import React, { Component, PropTypes } from 'react'

import './Panel.css'


class Panel extends Component {
	static propTypes = {
		message: PropTypes.string.isRequired,
		children: PropTypes.node.isRequired,
		coords: PropTypes.object.isRequired,
	}

	render() {
		const { children, message, coords } = this.props

		return 	(
			<div
				className='panel'
				style={{
					top: coords.y + 'px',
					left: coords.x + 'px',
					position: 'absolute',
				}}
			>
				<div>{message}</div>
				{children}
			</div>
		)	
	}
}

export default Panel