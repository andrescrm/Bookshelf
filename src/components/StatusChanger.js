import React, { Component } from 'react'

class StatusChanger extends Component {
    render() {
			const { defaultOption, onStatusChanged } = this.props

			return (
				<div className="book-shelf-changer">
					<select onChange={onStatusChanged} value={defaultOption}>
						<option value="move" disabled>Move to...</option>
						<option value="currentlyReading">Currently Reading</option>
						<option value="wantToRead">Want to Read</option>
						<option value="read">Read</option>
						<option value="none">None</option>
					</select>
				</div>
			)
    }    
}

export default StatusChanger