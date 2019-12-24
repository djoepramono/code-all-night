import React from "react"

export const SearchForm = ({ searchQuery, handleSubmit, searchData }) => {
  return <form onSubmit={handleSubmit}>
    <div style={{ margin: "0 auto" }}>
      <label htmlFor="Search" style={{ paddingRight: "10px" }}>
        Enter your search here
      </label>
      <input
        id="Search"
        value={searchQuery}
        onChange={searchData}
        placeholder="Enter your search here"
        style={{ margin: "0 auto", width: "400px" }}
      />
    </div>
  </form>
}
