import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { color, font } from "../helper"

const CleanLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const PostArticle = styled.div`
  background-color: white;
  color: ${color.dimmedBlack};
  text-decoration: none;
  padding: 1em;
  min-height: 230px;
  border-radius: 8px;
`

const PostTitle = styled.div`
  font-size: 1.5em;
  line-height: 1.5em;
  font-weight: bold;
`
const PostMetaData = styled.div`
  font-style: italic;
  font-size: ${font.small};
`
const PostExcerpt = styled.p`
  padding-top: 0.5em;
`

export const CollectionItem = ({ post }) => (
  <PostArticle key={post.id}>
    <CleanLink to={post.path}>
      <PostTitle>{post.title}</PostTitle>
    </CleanLink>
    <PostMetaData>
      By {post.author}, {post.date} ({post.timeToRead} min read)
    </PostMetaData>
    <PostExcerpt>{post.excerpt}</PostExcerpt>
  </PostArticle>
)
