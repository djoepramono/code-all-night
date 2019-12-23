import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { color, font } from "./helper"

const Wrapper = styled.section`
  padding-bottom: 2em;
  padding-top: 0em;
`

const PostArticle = styled.article`
  border-bottom: 1px solid ${color.dimmedBlack};
  color: ${color.dimmedBlack};
`
const PostAuthor = styled.div``
const PostMetaData = styled.div`
  font-style: italic;
  font-size: ${font.small};
`
const PostExcerpt = styled.p`
  padding-top: 0.5em;
`;

const PostLink = ({ post }) => (
  <div key={post.id}>
    <Wrapper>
      <Link to={post.frontmatter.path}>
        <PostArticle>
          <h3 className="title">{post.frontmatter.title}</h3>
          <PostAuthor>{post.frontmatter.author}</PostAuthor>
          <PostMetaData>
            {post.frontmatter.date} ({post.timeToRead} min read)
          </PostMetaData>
          <PostExcerpt>{post.excerpt}</PostExcerpt>
        </PostArticle>
      </Link>
    </Wrapper>
  </div>
)

export default PostLink
