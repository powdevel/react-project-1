import React from 'react'
import Book from './Book'

class BookShelf extends React.Component {
    render() {

        console.log(this.props);

        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">
                    { this.props.id.replace(/([a-z](?=[A-Z]))/g, '$1 ') }
                </h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {
                            this.props.books.map( e =>
                                <li key={e.title}>
                                    <Book data={e}>
                                    </Book>
                                </li>
                            )
                        }
                    </ol>
                </div>
            </div>
        )
    }
}

export default BookShelf;
