import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { color, font } from "../helper"

const Wrapper = styled.section`
  padding-bottom: 1em;
  padding-top: 0em;
  text-decoration: none;
`

const CleanLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const PostArticle = styled.article`
  border-bottom: 1px solid ${color.dimmedBlack};
  color: ${color.dimmedBlack};
  text-decoration: none;
`

const PostTitle = styled.h2`
  margin-bottom: 0.5em;
`
const PostMetaData = styled.div`
  font-style: italic;
  font-size: ${font.small};
`
const PostExcerpt = styled.p`
  padding-top: 0.5em;
`

export const SearchResult = ({ post }) => (
  <div key={post.id}>
    <Wrapper>
      <PostArticle>
        <CleanLink to={post.path}>
          <PostTitle>{post.title}</PostTitle>
        </CleanLink>
        <PostMetaData>
          By {post.author}, {post.date} ({post.timeToRead} min read)
        </PostMetaData>
        <PostExcerpt>{post.excerpt}</PostExcerpt>
      </PostArticle>
    </Wrapper>
  </div>
)
