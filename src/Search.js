import React from 'react'
import Book from './Book'
import {Link} from 'react-router-dom'
import DebounceInput from 'react-debounce-input'

class Search extends React.Component {

  state = {
    query: '',
    filteredBooks: []
  }

  updateFilteredBooks = (query) => {
    const searchBinA = (b, a) => a.toLowerCase().indexOf(b.toLowerCase()) !== -1;

    const joinTitleAndAuthors = e => {
      e.titleAndAuthors = e.title + e.authors.join("")
      return e;
    }
    let filteredBooks = this.props.getBooks(query).map(joinTitleAndAuthors).filter(e => searchBinA(query, e.titleAndAuthors));
    filteredBooks.map(e => <Book data={e} key={e.title} updateBook={this.props.updateBook}/>);
    this.setState({query: query, filteredBooks: filteredBooks});
  }

  render() {
    return (<div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <DebounceInput debounceTimeout={300} onChange={event => this.updateFilteredBooks(event.target.value)}/>
        </div>
      </div>
      {
        this.state.query !== "" && (<div className="search-books-results">
          <ol className="books-grid">
            {this.state.filteredBooks.map(e => <Book data={e} updateBook={this.props.updateBook} key={e.title}/>)}
          </ol>
        </div>)
      }
      {
        this.state.query === "" && (<center>
          <p className="search-books-results">Your search results will appear right here :)</p>
        </center>)
      }

    </div>)
  }
}

export default Search;
