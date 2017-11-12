import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import {Link, Route} from 'react-router-dom'
import Search from './Search.js'

class BooksApp extends React.Component {
  state = {
    books: [],
    bookshelfs: []
  }

  constructor(props) {
    super(props);
    this.loadBooks();
  }

  initializeBookShelfs() {
    let bookshelfs = this.state.books.map(e => e.shelf).filter((e, i, self) => self.indexOf(e) === i);
    this.setState({bookshelfs: bookshelfs});
  }

  loadBooks() {
    BooksAPI.getAll().then(data => {
      this.setState({books: data});
      this.initializeBookShelfs();
    });
  }

  getBooks = () => this.state.books;

  booksFromBookShelf(bookshelf, books) {
    return books.filter(e => e.shelf === bookshelf);
  }

  updateBook = (title, shelf) => {
    BooksAPI.update(title, shelf)

    let books = this.state.books.map(e => {
      if (e.title === title) {
        e.shelf = shelf;
      }
      return e;
    });

    this.setState({books: books});
  }

  render() {

    return (<div className="app">

      <Route path="/search" exact={true} render={() => <Search getBooks={this.getBooks} updateBook={this.updateBook}/>}/>

      <Route path="/" exact={true} render={() => <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              {this.state.bookshelfs.map(e => <BookShelf books={this.booksFromBookShelf(e, this.state.books)} id={e} key={e} updateBook={this.updateBook}></BookShelf>)}
            </div>
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
