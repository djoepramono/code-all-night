import React from "react"

export const SearchForm = ({ searchQuery, handleSubmit, searchData }) => {
  return <form onSubmit={handleSubmit}>
    <div style={{ margin: "0 auto" }}>      
      <input
        id="Search"
        value={searchQuery}
        onChange={searchData}
        placeholder="Search a post e.g. git"
        style={{ margin: "0 auto", width: "100%" }}
      />
    </div>
  </form>
}
