import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { SearchResult } from "../components/clientSearch/searchResult"
import { transformRemarkEdgeToPost } from "../libraries/transformer"
import Pagination from "../components/pagination"
import ClientSearch from "../components/clientSearch/index"

const ListPage = props => {
  const posts = props.data.allMarkdownRemark.edges.map(
    transformRemarkEdgeToPost
  )

  const { pageContext } = props
  const { noOfPages, currentPage, search } = pageContext
  return (
    <Layout>
      {posts.map((post, index) => {
        return <SearchResult key={index} post={post} />
      })}
      <Pagination currentPage={currentPage} noOfPages={noOfPages} />
    </Layout>
  )
}

export default ListPage

export const listQuery = graphql`
  query listQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      ...MarkdownEdgesFragment
    }
  }
`
