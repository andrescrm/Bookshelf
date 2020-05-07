import React, { Component } from 'react'
import BookList from './BookList'

class SearchBook extends Component {
	render() {
		const { onSearch, onStateChange, resultSearch, history } = this.props

		return (
			<div className="search-books">
				<div className="search-books-bar">
					<button className="close-search" onClick={() => history.push('./')}>Close</button>
					<div className="search-books-input-wrapper">
						<input type="text" placeholder="Search by title or author" onChange={onSearch} />
					</div>
				</div>
				<div className="search-books-results">
					{resultSearch != null && <BookList books={resultSearch} onChange={onStateChange} />}
				</div>
			</div>
		)
	}
}

export default SearchBook