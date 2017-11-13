import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import {Link, Route} from 'react-router-dom'
import Search from './Search.js'
import {AnimatedSwitch} from 'react-router-transition'

function mapStyles(styles) {
  return {opacity: styles.o}
}

// child matches will...
const fadeTransition = {
  atEnter: {
    o: 1
  },
  atLeave: {
    o: 0
  },
  atActive: {
    o: 1
  }
};

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
    return ['currentlyReading', 'wantToRead', 'read'];
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

  updateBook = (book, shelf) => {
    BooksAPI.update(book, shelf)
    let books = this.state.books.map((e) => this.changeShelfFromBook(e, book.title, shelf))
    this.setState({books: books});
  }

  render() {

    return (<div className="app">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>

      <div className="relative-wrapper">
        <AnimatedSwitch atEnter={fadeTransition.atEnter} atLeave={fadeTransition.atLeave} atActive={fadeTransition.atActive} mapStyles={mapStyles} className="route-wrapper">
          <Route path="/search" exact={true} render={() => <Search getBooks={this.getBooks} updateBook={this.updateBook}/>}/>

          <Route path="/" exact={true} render={() => <div className="list-books">
              <div className="list-books-content">
                {this.state.bookshelfs.map(e => <BookShelf books={this.booksFromBookShelf(e, this.state.books)} id={e} key={e} updateBook={this.updateBook}></BookShelf>)}
                {!this.state.loaded && (<div className="book-loader">Preparing contents...</div>)}
              </div>
              <div className="open-search">
                <Link to="/search">
                  Add a book
                </Link>
              </div>
            </div>}/>
        </AnimatedSwitch>
      </div>

    </div>)
  }
}

export default BooksApp
