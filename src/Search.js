import React from 'react'
import Book from './Book'
import {Link} from 'react-router-dom'
import DebounceInput from 'react-debounce-input'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

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
      <div className="search-books-results">
        <TransitionGroup component="ol" className="books-grid">
          {
            this.state.query !== "" && this.state.filteredBooks.map(e => <Fade key={e.title}>
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
