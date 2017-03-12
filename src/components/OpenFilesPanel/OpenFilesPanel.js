import React, { Component, PropTypes } from 'react'

import Panel from '../../components-lib/Panel/Panel'
import FileList from './FileList/FileList'
import OpenDropFileButton from '../../components-lib/OpenDropFileButton/OpenDropFileButton'
import Button from '../../components-lib/Button/Button'
import ExportButton from '../../components-lib/ExportButton/ExportButton'
import './OpenFilesPanel.css'


class OpenFilesPanel extends Component {
	static propTypes = {
		message: PropTypes.string.isRequired,
		files: PropTypes.object.isRequired,
		timelines: PropTypes.object.isRequired,
		onOpen: PropTypes.func.isRequired,
		onClearAll: PropTypes.func.isRequired,
		onClearFile: PropTypes.func.isRequired,
		onToggleHideFile: PropTypes.func.isRequired,
		
	}

	render() {
		const { message, files, timelines, onOpen, onClearAll, onToggleHideFile, onClearFile } = this.props

		return (
			<div
				className='open-files-panel'
			>
				<Panel
					message={message}
				>	
					<FileList
						files={files}
						onClearFile={onClearFile}
						onToggleHideFile={onToggleHideFile}
					/>
					<div>
						<OpenDropFileButton onOpen={onOpen}/>
						<Button text='Clear' onClick={onClearAll}/>
						<ExportButton
							data={timelines}
							text='Export'
						/>
					</div>	
				</Panel>
			</div>	
		)	

	}
}

export default OpenFilesPanel