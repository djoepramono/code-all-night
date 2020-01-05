import React from "react"
import styled from "styled-components"

const StyledInput = styled.input`
  margin: 0 auto;
  width: 100%;
  height: 2.5em;
  padding: 4px;
  
`

export const SearchForm = ({ searchQuery, handleSubmit, searchData }) => {
  return (
    <form onSubmit={handleSubmit}>
      <StyledInput
        id="Search"
        value={searchQuery}
        onChange={searchData}
        placeholder="Search a post e.g. gatsby"
      />
    </form>
  )
}
