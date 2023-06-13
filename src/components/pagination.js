import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { color, font } from "./helper"

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  text-align: center;
  margin-top: 1em;
`

const PaginationLink = styled(Link)`
  text-decoration: none;
  width: 200px;
`

const PaginationDiv = styled.div`
  width 200px;
`

const Pagination = ({ currentPage, noOfPages }) => {
  return (
    <Wrapper>
      {currentPage !== 1 ? (
        <PaginationLink to={`/list-${currentPage - 1}`}>
          Previous
        </PaginationLink>
      ) : (
        <PaginationDiv />
      )}
      <PaginationDiv>
        Page {currentPage} of {noOfPages}
      </PaginationDiv>
      {currentPage !== noOfPages ? (
        <PaginationLink to={`/list-${currentPage + 1}`}>Next </PaginationLink>
      ) : (
        <PaginationDiv />
      )}
    </Wrapper>
  )
}

export default Pagination
