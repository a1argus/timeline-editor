import React, { Component, PropTypes } from 'react'
import './ClearButton.css'

class ClearButton extends Component {
	static propTypes = {
		onClear: PropTypes.func.isRequired,
	}

	render() {
		return (
			<div
				className='drop-files__clear-button'
				onClick={this.props.onClear}
			>
				Clear
			</div>
		)
	}
}

export default ClearButton