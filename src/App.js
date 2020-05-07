import React from 'react'
import { Route } from 'react-router-dom'
import { throttle } from 'throttle-debounce'
import { createBrowserHistory } from "history"

import BookList from './components/BookList'
import SearchBook from './components/SearchBook'
import * as BookApi from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {    
    currentlyReading: [],
    wantToRead: [],
    read: [],
    search: [],
    booksOnShelf: []
  }

  componentDidMount() {
    this.queryAllBooks();
    this.autocompleteSearchThrottled = throttle(500, this.autocompleteSearch);
  }

  componentWillMount() {
    this.unlisten = createBrowserHistory().listen(() => {
      this.resetSearchPage()
    });
  }
  componentWillUnmount() {
      this.unlisten();
  }

  queryAllBooks = () => {
    const searchResult = this.state.search

    BookApi.getAll()
      .then((data) => {
        if(data.length !== 0) {          
          this.setState({
            booksOnShelf: data.map(c => { return { bookId: c.id, shelf: c.shelf } }),
            currentlyReading: data.filter(c => c.shelf === 'currentlyReading'),
            wantToRead: data.filter(c => c.shelf === 'wantToRead'),
            read: data.filter(c => c.shelf === 'read')            
          })
          this.updateSearchStatus(searchResult)
          this.setState({
            search: searchResult
          })     
        }
      })
  }

  openSearch = (history) => {
    this.setState({
      search: []
    });
    history.push('/search');
  }

  updateSearchStatus = (resultSearch) => {
    if(resultSearch) {
			this.state.booksOnShelf.forEach(book => {
				const searchItem = resultSearch.find(item => item.id === book.bookId);
				if(searchItem) {
					searchItem.shelf = book.shelf;
				}
      })      
    }
  }
  
  autocompleteSearch = (query) => {
    if(query !== '') {
      BookApi.search(query)
        .then((data) => {          
          if(!data || !data.items) {           
            this.updateSearchStatus(data) 
            this.setState({
              search: data
            })
          } else {
            this.resetSearchPage()
          }
        })
    } else {
      this.resetSearchPage()
    }
  }

  resetSearchPage = () => {
    this.setState({
      search: []
    })
  }

  onStateChange = (book, stateValue) => {    
    BookApi.update(book, stateValue)
      .then((data) => {
        this.queryAllBooks();        
      })    
  }  

  onSearch = (event) => {
    this.autocompleteSearchThrottled(event.target.value)
  }

  render() {
    const { currentlyReading, wantToRead, read, search } = this.state

    return (
      <div className="app">
          <Route exact path='/' render={({history}) => (
            <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <BookList title="Currently Reading" books={currentlyReading} onChange={this.onStateChange} />
              <BookList title="Want to Read" books={wantToRead} onChange={this.onStateChange} />
              <BookList title="Read" books={read} onChange={this.onStateChange} />
            </div>
            <div className="open-search">
              <button onClick={() => this.openSearch(history)}>Add a book</button>
            </div>
          </div>
          )} />
          
          <Route path='/search' render={({history}) => (
            <SearchBook onSearch={this.onSearch} onStateChange={this.onStateChange} resultSearch={search} history={history} />
          )} />                  
      </div>
    )
  }
}

export default BooksApp
