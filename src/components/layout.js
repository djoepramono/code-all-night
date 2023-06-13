import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Sidebar from "./sidebar"
import "./layout.css"
import styled from "styled-components"
import { screen, color } from "./helper"

// f7b83d yellow
// 242b2f black
// 70b2bb blue

const TwoColumns = styled.div`
  max-width: 1280px;
  display: flex;

  // for some reason on mobile view,
  // this flex item can grow larger than the screen
  // to stop this we either need 'width: 100%' or 'overflow: auto'
  width: 100%;
`

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${color.blueishGrey};
`

const Content = styled.main`
  flex-grow: 1;
  overflow: auto;
  padding: 2em 5em 2em 5em;

  @media ${screen.phone} {
    padding: 0.5em;
  }
`

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <ContentContainer>
        <TwoColumns>
          <Sidebar homeLink="http://localhost:8000" />
          <Content>{children}</Content>
        </TwoColumns>
      </ContentContainer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
