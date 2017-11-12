import React from 'react'
import Book from './Book'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

const Fade = ({
  children,
  ...props
}) => (<CSSTransition {...props} timeout={250} classNames="fade">
  {children}
</CSSTransition>);

class BookShelf extends React.Component {
  render() {
    return (<div className="bookshelf">
      <h2 className="bookshelf-title">
        {this.props.id.replace(/([a-z](?=[A-Z]))/g, '$1 ')}
      </h2>
      <div className="bookshelf-books">
        <TransitionGroup component="ol" className="books-grid">
          {
            this.props.books.map(e => <Fade key={e.title}>
              <li>
                <Book data={e} updateBook={this.props.updateBook}></Book>
              </li>
            </Fade>)
          }
        </TransitionGroup>
        {
          this.props.books.length === 0 && (<center>
            <p>No books found in this category</p>
          </center>)
        }
      </div>
    </div>)
  }
}

export default BookShelf;
