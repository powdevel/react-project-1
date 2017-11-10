import React from 'react'

class Book extends React.Component {
    render() {


        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={
                            { width: 128, height: 193, backgroundImage: `url("${this.props.data.imageLinks.thumbnail}")` }
                        }>
                    </div>
                    <div className="book-shelf-changer">
                        <select defaultValue={this.props.data.shelf} >
                            <option value="none" disabled>Move to...
                            </option>
                            <option value="currentlyReading">Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read
                            </option>
                            <option value="read">Read
                            </option>
                            <option value="none">None
                            </option>
                        </select>
                    </div>
                </div>
                <div className="book-title"> { this.props.data.title }
                </div>
                <div className="book-authors"> { this.props.data.authors.join(' ') }
                </div>
            </div>
        )
    }
}

export default Book;
