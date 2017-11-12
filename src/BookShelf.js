import React from 'react'
import Book from './Book'

class BookShelf extends React.Component {
  render() {
    return (<div className="bookshelf">
      <h2 className="bookshelf-title">
        {this.props.id.replace(/([a-z](?=[A-Z]))/g, '$1 ')}
      </h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {
            this.props.books.map(e => <li key={e.title}>
              <Book data={e} updateBook={this.props.updateBook}></Book>
            </li>)
          }
          {
            this.props.books.length === 0 && (<center>
              <p>No books found in this category</p>
            </center>)
          }
        </ol>
      </div>
    </div>)
  }
}

export default BookShelf;
