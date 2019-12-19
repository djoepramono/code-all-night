import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { screen, color } from "./helper"
import { FixedLogo } from "./logo/fixedLogo"

const Wrapper = styled.header`
  height: 3.5em;
  padding: 0 3em;
  background-color: ${color.dimmedBlack};

  display: flex;
  align-items: center;

  @media ${screen.tabletOrLarger} {
    display: none;
  }
`

const LogoWrapper = styled.div``

const SiteTitle = styled.div`
  color: ${color.lightBlue};
  margin-left: 15px;
`

const Header = ({ siteTitle }) => (
  <Wrapper>
    <FixedLogo />
    <SiteTitle>
      <Link to="/" style={{ color: color.lightBlue }}>
        {siteTitle}
      </Link>
    </SiteTitle>
  </Wrapper>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
