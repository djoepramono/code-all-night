import { graphql } from "gatsby"

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
        excerpt
        timeToRead
      }
    }
  }
`
