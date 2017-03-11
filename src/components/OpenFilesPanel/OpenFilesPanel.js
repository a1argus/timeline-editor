import React, { Component, PropTypes } from 'react'

import Panel from './Panel/Panel'
import FileList from './FileList/FileList'
import OpenDropFileButton from './OpenDropFileButton/OpenDropFileButton'
import ClearButton from './ClearButton/ClearButton'
import './OpenFilesPanel.css'


class OpenFilesPanel extends Component {
	static propTypes = {
		message: PropTypes.string.isRequired,
		files: PropTypes.array.isRequired,
		coords: PropTypes.object.isRequired,
		onClear: PropTypes.func.isRequired,
		onOpen: PropTypes.func.isRequired,
		
	}

	render() {
		const { message, files, coords, onOpen, onClear } = this.props

		return (
			<Panel
				message={message}
			    coords={coords}
			>	
				<FileList files={files}/>
				<div>
					<OpenDropFileButton onOpen={onOpen}/>
					<ClearButton onClear={onClear}/>
				</div>	
			</Panel>
		)	

	}
}

export default OpenFilesPanel