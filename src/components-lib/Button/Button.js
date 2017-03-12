import React, { Component, PropTypes } from 'react'
import './Button.css'

class Button extends Component {
	static propTypes = {
		text: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
	}

	render() {
		let { text, onClick } = this.props
		return (
			<div
				className='lib__button'
				onClick={onClick}
			>
				{text}
			</div>
		)
	}
}

export default Button