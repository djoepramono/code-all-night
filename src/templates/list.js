import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { transformRemarkEdgeToPost } from "../libraries/transformer"
import Pagination from "../components/pagination"
import { Collection } from "../components/collection"

const ListPage = props => {
  const posts = props.data.allMarkdownRemark.edges.map(
    transformRemarkEdgeToPost
  )

  const { pageContext } = props
  const { noOfPages, currentPage, search } = pageContext
  return (
    <Layout>
      <Collection posts={posts} />
      <Pagination currentPage={currentPage} noOfPages={noOfPages} />
    </Layout>
  )
}

export default ListPage

export const MarkdownEdgesFragment = graphql`
  fragment MarkdownEdgesFragment on MarkdownRemarkConnection {
    edges {
      node {
        frontmatter {
          title
          date(formatString: "DD MMMM YYYY")
          author
          path
        }
        excerpt(pruneLength: 500)
        timeToRead
      }
    }
  }
`

export const listQuery = graphql`
  query listQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      limit: $limit
      skip: $skip
    ) {
      ...MarkdownEdgesFragment
    }
  }
`
