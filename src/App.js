import React from "react";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import * as BooksAPI from "./BooksAPI";
import Main from "./Main";
import Search from "./Search";
import "./App.css";

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

  // to show an indicator of loading
  loadingClass = () => (this.state.loading ? "loading" : "");

  // one more loading process
  loadingMORE = () => this.setState({ loading: this.state.loading + 1 });

  loadingLESS = () => this.setState({ loading: this.state.loading > 1 ? this.state.loading - 1 : 0 });

  // to hide loading indicator no matter what
  loadingOFF = () => this.setState({ loading: 0 });

  loadBooks() {
    BooksAPI.getAll()
      .then(books => {
        this.setState({ books: books, loaded: true });
      })
      .catch(() => {
        this.setState({ message: "Unable to fetch contents... Are you connected to the Internet?" });
      });
  }

  getBooks = () => this.state.books;

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
        let iHaveThatBook = this.state.books.find(this.findBookByID, book);
        let updatedBooks = iHaveThatBook ? this.state.books.map(this.updateBookShelf, book) : this.state.books.concat(book);
        this.setState({ books: updatedBooks });
        this.loadingLESS();
      })
      .catch(() => {
        this.loadingLESS();
      });
  };

  render() {
    let me = this.state; // to simplify code
    return (
      <div className="app">
          {/* Common header */}
          <div className="list-books-title">
              <h1>
                  MyReads <span className={this.loadingClass()} />
              </h1>
          </div>
          {/* The routes */}
          <div className="relative-wrapper">
              <AnimatedSwitch atEnter={{ o: 1 }} atLeave={{ o: 0 }} atActive={{ o: 1 }} mapStyles={styles => ({ opacity: styles.o })} className="route-wrapper">
                  <Route path="/search" exact={true} render={() => <Search getBooks={this.getBooks} updateBook={this.updateBook} loadingMORE={this.loadingMORE} loadingOFF={this.loadingOFF} />} />
                  <Route path="/" exact={true} render={() => <Main loaded={me.loaded} bookshelfs={me.bookshelfs} books={me.books} message={me.message} updateBook={this.updateBook} />} />
              </AnimatedSwitch>
          </div>
      </div>
    );
  }
}

export default BooksApp;
