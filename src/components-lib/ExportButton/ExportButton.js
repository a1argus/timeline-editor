import React, { Component, PropTypes } from 'react'
import './ExportButton.css'

class ExportButton extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		text: PropTypes.string.isRequired,
	}

	onClick(ev) {
		let URL = window.URL || window.webkitURL
		let blob = new Blob([JSON.stringify(this.props.data, null, 4)], {type: 'text/json'})
		ev.target.href = URL.createObjectURL(blob)
		ev.target.download = 'data.json'
	}

	render() {
		let { text } = this.props
		return (
			<a
				className='lib__export-button'
				onClick={this.onClick.bind(this)}
			>
				{text}
			</a>
		)
	}
}

export default ExportButton