import React, { Component } from 'react'
import StatusChanger from './StatusChanger'

class BookList extends Component {

	render() {
		const { title, books, onChange } = this.props

		return (
			<div>
				<h2 className="bookshelf-title">{title}</h2>
				<div className="bookshelf-books">
					<ol className="books-grid">
						{books.map((book) => (
							<li key={book.id}>
								<div className="book">
									<div className="book-top">
										<div className="book-cover" style={{ width: 128, height: 193, backgroundImage: book.imageLinks != null ? `url('${book.imageLinks.thumbnail}')` : '' }}></div>
										<StatusChanger onStatusChanged={(event) => onChange(book, event.target.value)} defaultOption={book.shelf ? book.shelf : 'none'} />
									</div>
									<div className="book-title">{book.title}</div>
									{book.authors ? book.authors.map(author => <div key={author} className="book-authors">{author}</div>) : <div className="book-authors">No author</div>}
								</div>
							</li>
						))}					
					</ol>
				</div>
			</div>
		)
	}
}

export default BookList