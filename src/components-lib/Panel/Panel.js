import React, { Component, PropTypes } from 'react'

import './Panel.css'


class Panel extends Component {
	static propTypes = {
		message: PropTypes.string.isRequired,
		children: PropTypes.node.isRequired,
	}

	render() {
		const { children, message } = this.props

		return 	(
			<div
				className='panel'
			>
				<div>{message}</div>
				{children}
			</div>
		)	
	}
}

export default Panel