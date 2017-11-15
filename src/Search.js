import React from "react";
import Book from "./Book";
import { Link } from "react-router-dom";
import DebounceInput from "react-debounce-input";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import * as BooksAPI from "./BooksAPI";

const Fade = ({ children, ...props }) => (
    <CSSTransition {...props} timeout={250} classNames="fade">
        {children}
    </CSSTransition>
);

class Search extends React.Component {
    state = {
        query: "",
        filteredBooks: []
    };

    // To "break" the promise of fetching contents
    // is the search token is different
    searchToken = 0;

    processData = (query, fetchedBooks) => {
        this.props.loadingOFF(); // Hides loading indicator
        let myBooks = this.props.getBooks(); // Getting currently books on shelf

        // Updates the shelf of a book in the search result
        fetchedBooks = fetchedBooks.map(book => {
            let iHaveThatBook = myBooks.filter(myBook => myBook.id === book.id);
            book.shelf = iHaveThatBook.length ? iHaveThatBook[0].shelf : "none";
            return book;
        });
        this.changeSearchResults(query, fetchedBooks);
    };

    changeSearchResults = (query, books) => {
        this.setState({ query: query, filteredBooks: [] });
    };

    onQueryChange = query => {
        let token = ++this.searchToken;

        if (query === "") {
            // this.setState({query: query, filteredBooks: []});
            this.changeSearchResults("", []);
            this.props.loadingOFF(); // Hides loading indicator
            return;
        }

        this.props.loadingMORE();
        BooksAPI.search(query, 20)
            .then(fetchedBooks => {
                // Only pass if it's the last searched term
                if (token === this.searchToken) {
                    this.processData(query, fetchedBooks);
                }
            })
            .catch(() => {
                if (token === this.searchToken) {
                    // if something's wrong then show empty results
                    this.changeSearchResults(query, []);
                }
            });
    };

    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">
                        Close
                    </Link>
                    <div className="search-books-input-wrapper">
                        <DebounceInput
                            debounceTimeout={300}
                            onChange={event =>
                                this.onQueryChange(event.target.value.trim())
                            }
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <TransitionGroup component="ol" className="books-grid">
                        {this.state.query !== "" &&
                            this.state.filteredBooks.map(e => (
                                <Fade key={e.title}>
                                    <li>
                                        <Book
                                            data={e}
                                            updateBook={this.props.updateBook}
                                        />
                                    </li>
                                </Fade>
                            ))}
                    </TransitionGroup>
                    {this.state.query !== "" &&
                        this.state.filteredBooks.length === 0 && (
                            <p className="search-message">
                                No results found for your search
                            </p>
                        )}
                    {this.state.query === "" && (
                        <p className="search-message">
                            Your search results will appear right here :)
                        </p>
                    )}
                </div>
            </div>
        );
    }
}

export default Search;
