import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import BookShelf from "./BookShelf";
import { Link, Route } from "react-router-dom";
import Search from "./Search.js";
import { AnimatedSwitch } from "react-router-transition";

class BooksApp extends React.Component {
  state = {
    books: [],
    bookshelfs: ["currentlyReading", "wantToRead", "read"],
    loaded: false,
    loading: 0,
    message: "Preparing contents..."
  };

  constructor(props) {
    super(props);
    this.loadBooks();
  }

  loadingClass = () => (this.state.loading ? "loading" : "");

  loadingMORE = () =>
    this.setState({
      loading: this.state.loading + 1
    });

  loadingLESS = () =>
    this.setState({
      loading: this.state.loading > 1 ? this.state.loading - 1 : 0
    });

  loadingOFF = () => this.setState({ loading: 0 });

  loadBooks() {
    BooksAPI.getAll()
      .then(books => {
        this.setState({ books: books, loaded: true });
      })
      .catch(() => {
        this.setState({
          message: "Unable to fetch contents... Are you connected to the Internet?"
        });
      });
  }

  getBooks = () => this.state.books;

  fromBookShelf = function(book) {
    return book.shelf === this;
  };

  findBookByID = function(book) {
    return book.id === this.id;
  };

  updateBookShelf = function(book) {
    book.shelf = book.id === this.id ? this.shelf : book.shelf;
    return book;
  };

  updateBook = (book, shelf) => {
    book.shelf = shelf;
    this.loadingMORE();
    BooksAPI.update(book, shelf)
      .then(() => {
        let iHaveThatBook = this.state.books.filter(this.findBookByID, book);
        let updatedBooks = iHaveThatBook.length ? this.state.books.map(this.updateBookShelf, book) : this.state.books.concat(book);
        this.setState({ books: updatedBooks });
        this.loadingLESS();
      })
      .catch(() => {
        this.loadingLESS();
      });
  };

  render() {
    return (
      <div className="app">
          <div className="list-books-title">
              <h1>
                  MyReads
                  <span className={this.loadingClass()} />
              </h1>
          </div>

          <div className="relative-wrapper">
              <AnimatedSwitch atEnter={{ o: 1 }} atLeave={{ o: 0 }} atActive={{ o: 1 }} mapStyles={styles => ({ opacity: styles.o })} className="route-wrapper">
                  <Route path="/search" exact={true} render={() => <Search getBooks={this.getBooks} updateBook={this.updateBook} loadingMORE={this.loadingMORE} loadingOFF={this.loadingOFF} />} />
                  <Route
                      path="/"
                      exact={true}
                      render={() => (
                          <div className="list-books">
                              <div className="list-books-content">
                                  {this.state.loaded && this.state.bookshelfs.map(e => <BookShelf books={this.state.books.filter(this.fromBookShelf, e)} id={e} key={e} updateBook={this.updateBook} />)}
                                  {this.state.loaded && (
                                      <div className="open-search">
                                          <Link to="/search">Add a book</Link>
                                      </div>
                                  )}
                                  {!this.state.loaded && <div className="book-loader">{this.state.message}</div>}
                              </div>
                          </div>
                      )}
                  />
              </AnimatedSwitch>
          </div>
      </div>
    );
  }
}

export default BooksApp;
