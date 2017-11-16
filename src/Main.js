import React from "react";
import BookShelf from "./BookShelf";
import { Link } from "react-router-dom";

class Main extends React.Component {
  fromBookShelf = function(book) {
    return book.shelf === this;
  };

  render() {
    let props = this.props;
    return (
      <div className="list-books">
          <div className="list-books-content">
              {props.loaded && props.bookshelfs.map(e => <BookShelf books={props.books.filter(this.fromBookShelf, e)} id={e} key={e} updateBook={props.updateBook} />)}
              {props.loaded && (
                  <div className="open-search">
                      <Link to="/search">Add a book</Link>
                  </div>
              )}
              {!props.loaded && <div className="book-loader">{props.message}</div>}
          </div>
      </div>
    );
  }
}

export default Main;
