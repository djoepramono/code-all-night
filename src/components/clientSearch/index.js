import React, { Component } from "react"
import * as JsSearch from "js-search"
import { SearchForm } from "./searchForm"
import { SearchResult } from "./searchResult"
import styled from "styled-components"

const SearchCount = styled.div`
  padding: 1em 0;
`;

class ClientSearch extends Component {
  state = {
    isLoading: true,
    searchResults: [],
    search: null,
    isError: false,
    indexByTitle: false,
    indexByAuthor: false,
    termFrequency: true,
    removeStopWords: false,
    searchQuery: "",
    selectedStrategy: "",
    selectedSanitizer: "",
  }
  /**
   * React lifecycle method that will inject the data into the state.
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.search === null) {
      const { engine } = nextProps
      return {
        indexByTitle: engine.TitleIndex,
        indexByAuthor: engine.AuthorIndex,
        termFrequency: engine.SearchByTerm,
        selectedSanitizer: engine.searchSanitizer,
        selectedStrategy: engine.indexStrategy,
      }
    }
    return null
  }
  async componentDidMount() {
    this.rebuildIndex()
  }
  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const {
      selectedStrategy,
      selectedSanitizer,
      removeStopWords,
      termFrequency,
      indexByTitle,
      indexByAuthor,
    } = this.state
    const { posts } = this.props
    const dataToSearch = new JsSearch.Search("title")
    if (removeStopWords) {
      dataToSearch.tokenizer = new JsSearch.StopWordsTokenizer(
        dataToSearch.tokenizer
      )
    }
    /**
     * defines an indexing strategy for the data
     * read more about it here https://github.com/bvaughn/js-search#configuring-the-index-strategy
     */
    if (selectedStrategy === "All") {
      dataToSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()
    }
    if (selectedStrategy === "Exact match") {
      dataToSearch.indexStrategy = new JsSearch.ExactWordIndexStrategy()
    }
    if (selectedStrategy === "Prefix match") {
      dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
    }
    /**
     * defines the sanitizer for the search
     * to prevent some of the words from being excluded
     */
    selectedSanitizer === "Case Sensitive"
      ? (dataToSearch.sanitizer = new JsSearch.CaseSensitiveSanitizer())
      : (dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer())
    termFrequency === true
      ? (dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("isbn"))
      : (dataToSearch.searchIndex = new JsSearch.UnorderedSearchIndex())
    // sets the index attribute for the data
    if (indexByTitle) {
      dataToSearch.addIndex("title")
    }
    // sets the index attribute for the data
    if (indexByAuthor) {
      dataToSearch.addIndex("author")
    }
    dataToSearch.addDocuments(posts) // adds the data to be searched
    this.setState({ search: dataToSearch, isLoading: false })
  }
  /**
   * handles the input change and perform a search with js-search
   * in which the results will be added to the state
   */
  searchData = e => {
    const { search } = this.state
    const queryResult = search.search(e.target.value)

    this.setState({ searchQuery: e.target.value, searchResults: queryResult })
  }
  handleSubmit = e => {
    e.preventDefault()
  }
  render() {
    const { searchResults, searchQuery } = this.state
    const { posts } = this.props    

    const queryResults = searchQuery === "" ? posts : searchResults
    return (
      <div>
        <div style={{ margin: "0 auto" }}>
          <SearchForm
            searchQuery={searchQuery}
            handleSubmit={this.handleSubmit}
            searchData={this.searchData}
          />
          <SearchCount>Posts found: {queryResults.length}</SearchCount>
          {queryResults.map((item, index) => 
            <SearchResult key={index} post={item} />
          )}
        </div>
      </div>
    )
  }
}
export default ClientSearch
