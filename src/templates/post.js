import React from "react"
import { graphql } from "gatsby"
import Prism from "prismjs"
import { useEffect } from "react"
import styled from "styled-components"
import { font } from "../components/helper"
import Layout from "../components/layout"
import SEO from "../components/seo"

const PostContainer = styled.article``

const PostTitle = styled.h1`
  font-size: 40px;
  line-height: 41px;
`

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
  const { frontmatter, html, timeToRead } = markdownRemark

  useEffect(() => {
    Prism.highlightAll()
  })

  return (
    <Layout>
      <SEO title={frontmatter.title} />
      <PostContainer>
        <PostTitle>{frontmatter.title}</PostTitle>
        <PostMetaData>
          By {frontmatter.author}, {frontmatter.date} ({timeToRead} min read)
        </PostMetaData>
        <PostContent dangerouslySetInnerHTML={{ __html: html }}></PostContent>
      </PostContainer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($markdownPath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $markdownPath } }) {
      html
      frontmatter {
        date(formatString: "DD MMMM YYYY")
        author
        path
        title
      }
      timeToRead
    }
  }
`
export default PostTemplate
