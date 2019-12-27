import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Sidebar from "./sidebar"
import "./layout.css"
import styled from "styled-components"
import  { screen } from "./helper"

// f7b83d yellow
// 242b2f black
// 70b2bb blue

const TwoColumn = styled.div`
  display: flex;
`

const Content = styled.main`
  flex-grow: 1;

  height: 100vh;
  overflow: auto;
  padding: 2em 5em 0em 5em;

  @media ${screen.phone} {
    padding: 2em 1.5em 0em 1.5em;
    height: calc(100vh - 60px);
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
      <TwoColumn>
        <Sidebar homeLink="http://localhost:8000" />
        <Content>{children}</Content>
      </TwoColumn>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
