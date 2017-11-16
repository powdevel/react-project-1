import React from "react";
import Book from "./Book";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Fade = ({ children, ...props }) => (
  <CSSTransition {...props} timeout={250} classNames="fade">
      {children}
  </CSSTransition>
);

class BookShelf extends React.Component {
  firstLetterUp = title => title.charAt(0).toUpperCase() + title.slice(1);
  spaceBeforeCap = title => title.split("").reduce((title, letter) => title + (letter.toUpperCase() === letter ? " " : "") + letter, "");

  render() {
    return (
      <div className="bookshelf">
          <h2 className="bookshelf-title">{this.spaceBeforeCap(this.firstLetterUp(this.props.id))}</h2>
          <div className="bookshelf-books">
              <TransitionGroup component="ol" className="books-grid">
                  {this.props.books.map(e => (
                      <Fade key={e.id}>
                          <li>
                              <Book data={e} updateBook={this.props.updateBook} />
                          </li>
                      </Fade>
                  ))}
              </TransitionGroup>
              {this.props.books.length === 0 && (
                  <center>
                      <p>No books found in this category</p>
                  </center>
              )}
          </div>
      </div>
    );
  }
}

export default BookShelf;
