import React, { Component, PropTypes } from 'react'

import Panel from '../../components-lib/Panel/Panel'
import './TimelineEditorPanel.css'


class OpenFilesPanel extends Component {
	static propTypes = {
		message: PropTypes.string.isRequired,
	}

	render() {
		const { message } = this.props
		return (
			<div
				className='timeline-editor-panel'
			>
				<Panel
					message={message}
				>
					<div></div>
				</Panel>
			</div>
		)	
	}
}

export default OpenFilesPanel