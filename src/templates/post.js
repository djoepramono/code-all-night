import React from "react"
import { graphql } from "gatsby"
import Prism from "prismjs"
import { useEffect } from "react"
import styled from "styled-components"
import { font } from "../components/helper"

import Layout from "../components/layout"

const PostContainer = styled.article`  
`

const PostTitle = styled.h1``

const PostMetaData = styled.div`
  font-style: italic;
  font-size: ${font.small};
`

const PostContent = styled.div`
  padding-top: 0.5em;
`

const PostTemplate = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  //highlight
  useEffect(() => {
    // call the highlightAll() function to style our code blocks
    Prism.highlightAll()
  })

  return (
    <Layout>
      <PostContainer>
        <PostTitle>{frontmatter.title}</PostTitle>
        <PostMetaData>
          {frontmatter.author}, {frontmatter.date}
        </PostMetaData>
        <PostContent dangerouslySetInnerHTML={{ __html: html }}></PostContent>
      </PostContainer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        author
        path
        title
      }
    }
  }
`
export default PostTemplate
