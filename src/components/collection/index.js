import React from "react"
import styled from "styled-components"
import { CollectionItem } from "./collectionItem"

export const CollectionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-direction: column;
  // align-content: space-evenly;
`

export const Collection = ({ posts}) =>
(<CollectionContainer>
    {posts.map((post, index) => {
        return <CollectionItem key={index} post={post} />
    })}
</CollectionContainer>)

