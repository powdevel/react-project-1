import React from 'react'
import Book from './Book'
import {Link} from 'react-router-dom'
import DebounceInput from 'react-debounce-input'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import * as BooksAPI from './BooksAPI'

const Fade = ({
  children,
  ...props
}) => (<CSSTransition {...props} timeout={250} classNames="fade">
  {children}
</CSSTransition>);

class Search extends React.Component {

  state = {
    query: '',
    filteredBooks: []
  }

  // To "break" the promise of fetching contents
  // is the search token is different
  searchToken = 0;

  updateSearchedBooks = (query) => {
    let token = ++this.searchToken;

    if (query === "") {
      this.setState({query: query, filteredBooks: []});
      return;
    }

    BooksAPI
      .search(query, 20)
      .then(searchedBooks => {

        if (token === this.searchToken) {
          let myBooks = this
            .props
            .getBooks();

          searchedBooks = searchedBooks.map(book => {
            let iHaveThatBook = myBooks.filter(myBook => myBook.id === book.id);
            iHaveThatBook.length
              ? book = iHaveThatBook[0]
              : book.shelf = 'none';
            return book;
          });
          this.setState({query: query, filteredBooks: searchedBooks});
        }
      })
      .catch(() => {
        if (token == this.searchToken) {
          this.setState({query: query, filteredBooks: []});
        }
      });

  }

  render() {
    return (<div className="search-books">

      <div className="search-books-bar">
        <Link className="close-search" to="/">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <DebounceInput debounceTimeout={300} onChange={event => this.updateSearchedBooks(event.target.value.trim())}/>
        </div>
      </div>
      <div className="search-books-results">
        <TransitionGroup component="ol" className="books-grid">
          {
            this.state.query !== "" && this
              .state
              .filteredBooks
              .map(e => <Fade key={e.title}>
                <li><Book data={e} updateBook={this.props.updateBook}/></li>
              </Fade>)
          }
        </TransitionGroup>
        {this.state.query !== "" && this.state.filteredBooks.length === 0 && (<p className="search-message">No results found for your search</p>)}
        {this.state.query === "" && (<p className="search-message">Your search results will appear right here :)</p>)}
      </div>
    </div>)
  }
}

export default Search;
