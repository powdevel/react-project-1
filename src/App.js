import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import {Link, Route} from 'react-router-dom'
import Search from './Search.js'
import {AnimatedSwitch} from 'react-router-transition'

class BooksApp extends React.Component {
  state = {
    books: [],
    bookshelfs: [
      'currentlyReading', 'wantToRead', 'read'
    ],
    loaded: false,
    message: 'Preparing contents...'
  }

  constructor(props) {
    super(props);
    this.loadBooks();
  }

  loadBooks() {
    BooksAPI
      .getAll()
      .then(books => {
        this.setState({books: books, loaded: true});
      })
      .catch(() => {
        this.setState({message: 'Unable to fetch contents... Are you connected to the Internet?'})
      });
  }

  getBooks = () => this.state.books;

  fromBookShelf = function ( book ) { return book.shelf === this }

  updateBook = (book, shelf) => {
    BooksAPI
      .update(book, shelf)
      .then(() => BooksAPI.getAll())
      .then(books => this.setState({'books': books}));
  }

  render() {

    return (<div className="app">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>

      <div className="relative-wrapper">
        <AnimatedSwitch atEnter={{
            o: 1
          }} atLeave={{
            o: 0
          }} atActive={{
            o: 1
          }} mapStyles={styles => ({opacity: styles.o})} className="route-wrapper">
          <Route path="/search" exact={true} render={() => <Search getBooks={this.getBooks} updateBook={this.updateBook}/>}/>
          <Route path="/" exact={true} render={() => <div className="list-books">
              <div className="list-books-content">
                {
                  this.state.loaded && this
                    .state
                    .bookshelfs
                    .map(e => <BookShelf books={ this.state.books.filter( this.fromBookShelf, e ) } id={e} key={e} updateBook={this.updateBook}></BookShelf>)
                }
                {
                  this.state.loaded && (<div className="open-search">
                    <Link to="/search">
                      Add a book
                    </Link>
                  </div>)
                }
                {!this.state.loaded && (<div className="book-loader">{this.state.message}</div>)}
              </div>
            </div>}/>
        </AnimatedSwitch>
      </div>
    </div>)
  }
}

export default BooksApp
