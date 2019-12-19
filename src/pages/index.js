import React from "react"

import Layout from "../components/layout"
import PostLink from "../components/postLink"
import SEO from "../components/seo"
import styled from "styled-components"
import Profile from "../components/profile"

export const query = graphql`
  query HomePageQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date
            author
            path
          }
          excerpt
          timeToRead
        }
      }
    }
  }
`

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />    
    <div>
      {data.allMarkdownRemark.edges.map(edge => {
        return <PostLink key={edge.node.id} post={edge.node} />
      })}
    </div>
  </Layout>
)

export default IndexPage
