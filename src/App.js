import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import {Link, Route} from 'react-router-dom'
import Search from './Search.js'

class BooksApp extends React.Component {
  state = {
    books: [],
    bookshelfs: [],
    loaded: false
  }

  constructor(props) {
    super(props);
    this.loadBooks();
  }

  getBookShelfs(books) {
    return books.map(e => e.shelf).filter((e, i, self) => self.indexOf(e) === i);
  }

  loadBooks() {
    BooksAPI.getAll().then(books => {
      this.setState({books: books, bookshelfs: this.getBookShelfs(books), loaded: true});
    });
  }

  getBooks = () => this.state.books;

  booksFromBookShelf(bookshelf, books) {
    return books.filter(e => e.shelf === bookshelf);
  }

  changeShelfFromBook = (e, title, shelf) => {
    e.title === title && (e.shelf = shelf)
    return e;
  }

  updateBook = (title, shelf) => {
    BooksAPI.update(title, shelf)
    let books = this.state.books.map((e) => this.changeShelfFromBook(e, title, shelf))
    this.setState({books: books});
  }

  render() {

    return (<div className="app">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>

      <Route path="/search" exact={true} render={() => <Search getBooks={this.getBooks} updateBook={this.updateBook}/>}/>

      <Route path="/" exact={true} render={() => <div className="list-books">
          <div className="list-books-content">
            {this.state.bookshelfs.map(e => <BookShelf books={this.booksFromBookShelf(e, this.state.books)} id={e} key={e} updateBook={this.updateBook}></BookShelf>)}
            {!this.state.loaded && (<div className="book-loader">Loading contents...</div>)}
          </div>
          <div className="open-search">
            <Link to="/search">
              Add a book
            </Link>
          </div>
        </div>}/>

    </div>)
  }
}

export default BooksApp
